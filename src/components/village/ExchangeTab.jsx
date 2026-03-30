import { useState, useEffect, useMemo } from 'react'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import {
  COMMODITIES, getCommodityPrice, getPriceHistory, getPriceRange, currentTick,
} from '../../constants/exchange.js'
import styles from './ExchangeTab.module.css'

function Sparkline({ history, width = 60, height = 22 }) {
  if (!history || history.length < 2) return null
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const pts = history.map((p, i) => {
    const x = (i / (history.length - 1)) * width
    const y = height - ((p - min) / range) * (height - 4) - 1
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const lastUp = history[history.length - 1] >= history[history.length - 2]
  return (
    <svg width={width} height={height} className={styles.sparkline}>
      <polyline
        points={pts}
        fill="none"
        stroke={lastUp ? '#60c060' : '#c05050'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ExchangeTab() {
  const store = useStore()
  const { gold, portfolio } = store
  const [tick, setTick] = useState(currentTick)
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)

  // Re-check tick every 30s; update state only when tick actually changes
  useEffect(() => {
    const id = setInterval(() => {
      const t = currentTick()
      setTick(prev => prev !== t ? t : prev)
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  const prices = useMemo(
    () => Object.fromEntries(COMMODITIES.map(c => [c.id, getCommodityPrice(c.id, tick)])),
    [tick]
  )
  const prevPrices = useMemo(
    () => Object.fromEntries(COMMODITIES.map(c => [c.id, getCommodityPrice(c.id, tick - 1)])),
    [tick]
  )
  const histories = useMemo(
    () => Object.fromEntries(COMMODITIES.map(c => [c.id, getPriceHistory(c.id)])),
    [tick]
  )
  // 7-day high/low — recomputed once per tick (pure math, no storage)
  const ranges = useMemo(
    () => Object.fromEntries(COMMODITIES.map(c => [c.id, getPriceRange(c.id)])),
    [tick]
  )

  // Total current portfolio value
  const portfolioValue = COMMODITIES.reduce((sum, c) => {
    const pos = portfolio?.[c.id]
    return sum + (pos?.units ? pos.units * prices[c.id] : 0)
  }, 0)

  const selectedPrice = selected ? prices[selected.id] : 0
  const maxBuy = selected ? Math.floor((gold ?? 0) / selectedPrice) : 0
  const maxSell = selected ? (portfolio?.[selected.id]?.units ?? 0) : 0

  const handleBuy = (commodity) => {
    const price = prices[commodity.id]
    const result = store.buyShares(commodity.id, qty, price)
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast(`Bought ${qty}× ${commodity.name} · -${qty * price}g`, 'info')
      setSelected(null)
      setQty(1)
    }
  }

  const handleSell = (commodity) => {
    const price = prices[commodity.id]
    const result = store.sellShares(commodity.id, qty, price)
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast(`Sold ${qty}× ${commodity.name} · +${result.gold}g`, 'gold')
      setSelected(null)
      setQty(1)
    }
  }

  const hasHoldings = COMMODITIES.some(c => (portfolio?.[c.id]?.units ?? 0) > 0)

  return (
    <div className={styles.exchange}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <span className={styles.gold}>{gold ?? 0}g</span>
          {portfolioValue > 0 && (
            <span className={styles.portfolioVal}>Portfolio value: {portfolioValue}g</span>
          )}
        </div>
        <p className={styles.lore}>Prices shift with the tides of commerce. Buy low, sell high.</p>
      </div>

      {/* Market list */}
      <div className={styles.list}>
        {COMMODITIES.map(c => {
          const price = prices[c.id]
          const prev = prevPrices[c.id]
          const change = price - prev
          const changePct = prev ? ((change / prev) * 100).toFixed(1) : '0.0'
          const isUp = change >= 0
          const pos = portfolio?.[c.id]
          const held = pos?.units ?? 0
          const isSelected = selected?.id === c.id

          const { high, low } = ranges[c.id]
          const rangeSpan = high - low || 1
          const position = Math.max(0, Math.min(1, (price - low) / rangeSpan))
          const positionPct = Math.round(position * 100)
          // Zone: near low = buy signal, near high = sell signal
          const zoneClass = position <= 0.25 ? styles.zoneLow
            : position >= 0.75 ? styles.zoneHigh
            : styles.zoneMid

          return (
            <div
              key={c.id}
              className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
              onClick={() => {
                setSelected(isSelected ? null : c)
                setQty(1)
              }}
            >
              <div className={styles.rowMain}>
                <div className={styles.nameBlock}>
                  <span className={styles.symbol}>{c.symbol}</span>
                  <span className={styles.name}>{c.name}</span>
                  {held > 0 && <span className={styles.heldBadge}>{held}×</span>}
                </div>
                <Sparkline history={histories[c.id]} />
                <div className={styles.priceBlock}>
                  <span className={styles.price}>{price}g</span>
                  <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(changePct)}%
                  </span>
                </div>
              </div>

              {/* 7-day range bar */}
              <div className={styles.rangeRow}>
                <span className={styles.rangeLow}>L {low}g</span>
                <div className={styles.rangeTrack}>
                  <div
                    className={`${styles.rangeMarker} ${zoneClass}`}
                    style={{ left: `${positionPct}%` }}
                    title={`${positionPct}% of 7-day range`}
                  />
                </div>
                <span className={styles.rangeHigh}>H {high}g</span>
                <span className={`${styles.rangeHint} ${zoneClass}`}>
                  {position <= 0.25 ? 'Near low' : position >= 0.75 ? 'Near high' : `${positionPct}%`}
                </span>
              </div>

              {isSelected && (
                <div className={styles.tradePanel} onClick={e => e.stopPropagation()}>
                  <div className={styles.qtyRow}>
                    <label className={styles.qtyLabel}>Qty</label>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                    >−</button>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className={styles.qtyInput}
                    />
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQty(q => q + 1)}
                    >+</button>
                    <span className={styles.qtyTotal}>{qty * price}g</span>
                  </div>

                  <div className={styles.tradeButtons}>
                    <button
                      className={styles.buyBtn}
                      onClick={() => handleBuy(c)}
                      disabled={maxBuy < 1 || qty > maxBuy}
                    >
                      Buy {qty} (−{qty * price}g)
                    </button>
                    <button
                      className={styles.sellBtn}
                      onClick={() => handleSell(c)}
                      disabled={maxSell < 1 || qty > maxSell}
                    >
                      Sell {qty} (+{qty * price}g)
                    </button>
                  </div>

                  <div className={styles.quickLinks}>
                    {maxBuy > 0 && (
                      <button
                        className={styles.quickBtn}
                        onClick={() => setQty(maxBuy)}
                      >
                        Max buy ({maxBuy})
                      </button>
                    )}
                    {maxSell > 0 && (
                      <button
                        className={styles.quickBtn}
                        onClick={() => setQty(maxSell)}
                      >
                        Sell all ({maxSell})
                      </button>
                    )}
                  </div>

                  {held > 0 && (
                    <div className={styles.posInfo}>
                      Holding {held} shares · avg buy {pos.avgBuyPrice}g · unrealised{' '}
                      <span className={price >= pos.avgBuyPrice ? styles.profit : styles.loss}>
                        {price >= pos.avgBuyPrice ? '+' : ''}{held * (price - pos.avgBuyPrice)}g
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Holdings summary */}
      {hasHoldings && (
        <div className={styles.portfolio}>
          <h3 className={styles.portfolioTitle}>Your Holdings</h3>
          {COMMODITIES.filter(c => (portfolio?.[c.id]?.units ?? 0) > 0).map(c => {
            const pos = portfolio[c.id]
            const price = prices[c.id]
            const value = pos.units * price
            const pnl = pos.units * (price - pos.avgBuyPrice)
            return (
              <div key={c.id} className={styles.holdingRow}>
                <span className={styles.holdingName}>{c.name}</span>
                <span className={styles.holdingUnits}>{pos.units}×</span>
                <span className={styles.holdingValue}>{value}g</span>
                <span className={`${styles.holdingPnl} ${pnl >= 0 ? styles.profit : styles.loss}`}>
                  {pnl >= 0 ? '+' : ''}{pnl}g
                </span>
              </div>
            )
          })}
          <div className={styles.holdingTotal}>
            <span>Total</span>
            <span className={styles.holdingValue}>{portfolioValue}g</span>
          </div>
        </div>
      )}
    </div>
  )
}
