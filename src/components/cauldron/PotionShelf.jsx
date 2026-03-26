import { useStore } from '../../store/index.js'
import { POTION_MAP } from '../../constants/potions.js'
import styles from './PotionShelf.module.css'

// SVG potion bottle, colored per potion
function Bottle({ color }) {
  return (
    <svg viewBox="0 0 36 56" width="36" height="56" aria-hidden="true">
      {/* Cork */}
      <rect x="13" y="1" width="10" height="6" rx="2" fill="#7a5030" />
      {/* Neck */}
      <rect x="14" y="7" width="8" height="10" rx="1" fill={color} opacity="0.78" />
      {/* Body */}
      <rect x="5" y="17" width="26" height="32" rx="7" fill={color} opacity="0.88" />
      {/* Liquid lower portion */}
      <rect x="5" y="33" width="26" height="16" rx="0 0 7 7" fill={color} opacity="0.45" />
      {/* Highlight shine */}
      <rect x="9" y="21" width="5" height="18" rx="2.5" fill="white" opacity="0.22" />
    </svg>
  )
}

// Atmospheric SVG shelf illustration
function ShelfIllustration() {
  return (
    <svg
      viewBox="0 0 400 130"
      width="100%"
      className={styles.shelfSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wall background */}
      <rect width="400" height="130" fill="#100d16" />

      {/* Stone block pattern */}
      {[0, 26, 52, 78, 104].map(y =>
        [0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((x, i) => (
          <rect
            key={`stone-${y}-${i}`}
            x={x + (y % 52 === 0 ? 0 : 20)} y={y}
            width="38" height="24"
            fill="none" stroke="#1e1828" strokeWidth="1" opacity="0.7"
          />
        ))
      )}

      {/* Left upright support */}
      <rect x="0" y="0" width="18" height="130" fill="#2a1c0c" />
      <rect x="16" y="0" width="2" height="130" fill="#1a1008" opacity="0.7" />
      {/* Wood grain lines on left support */}
      {[15, 35, 55, 75, 95, 115].map((y, i) => (
        <line key={i} x1="3" y1={y} x2="15" y2={y + 4} stroke="#3a2810" strokeWidth="1" opacity="0.5" />
      ))}

      {/* Right upright support */}
      <rect x="382" y="0" width="18" height="130" fill="#2a1c0c" />
      <rect x="382" y="0" width="2" height="130" fill="#1a1008" opacity="0.7" />
      {[15, 35, 55, 75, 95, 115].map((y, i) => (
        <line key={i} x1="385" y1={y} x2="397" y2={y + 4} stroke="#3a2810" strokeWidth="1" opacity="0.5" />
      ))}

      {/* === SHELF 1 (top) === */}
      {/* Shelf plank face (3D front edge) */}
      <rect x="18" y="46" width="364" height="8" fill="#3d2810" rx="1" />
      {/* Shelf plank top */}
      <rect x="18" y="38" width="364" height="9" fill="#5a3e18" rx="1" />
      {/* Wood grain on shelf 1 */}
      {[30, 80, 140, 200, 260, 320, 370].map((x, i) => (
        <line key={i} x1={x} y1="38" x2={x + 6} y2="47" stroke="#4a3010" strokeWidth="1" opacity="0.5" />
      ))}
      {/* Shelf bracket left */}
      <polygon points="18,54 30,54 18,70" fill="#261808" opacity="0.9" />
      {/* Shelf bracket right */}
      <polygon points="382,54 370,54 382,70" fill="#261808" opacity="0.9" />
      {/* Ambient glow under shelf 1 */}
      <rect x="18" y="54" width="364" height="12" fill="#c9a227" opacity="0.04" />

      {/* === SHELF 2 (bottom) === */}
      <rect x="18" y="100" width="364" height="8" fill="#3d2810" rx="1" />
      <rect x="18" y="92" width="364" height="9" fill="#5a3e18" rx="1" />
      {[30, 80, 140, 200, 260, 320, 370].map((x, i) => (
        <line key={i} x1={x} y1="92" x2={x + 6} y2="101" stroke="#4a3010" strokeWidth="1" opacity="0.5" />
      ))}
      <polygon points="18,108 30,108 18,124" fill="#261808" opacity="0.9" />
      <polygon points="382,108 370,108 382,124" fill="#261808" opacity="0.9" />
      <rect x="18" y="108" width="364" height="12" fill="#c9a227" opacity="0.04" />

      {/* === Candle on top shelf (right side) === */}
      {/* Candle wax */}
      <rect x="352" y="18" width="12" height="20" rx="2" fill="#e8dfc8" opacity="0.9" />
      {/* Candle drip */}
      <path d="M 352 22 Q 349 28 350 32 L 352 32 Z" fill="#e8dfc8" opacity="0.7" />
      {/* Wick */}
      <line x1="358" y1="18" x2="358" y2="14" stroke="#4a3820" strokeWidth="1.5" />
      {/* Flame outer */}
      <ellipse cx="358" cy="11" rx="4" ry="6" fill="#e07b39" opacity="0.7">
        <animate attributeName="rx" values="4;3;4.5;4" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="ry" values="6;7;5.5;6" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Flame inner */}
      <ellipse cx="358" cy="12" rx="2" ry="4" fill="#f4d060" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.7;1;0.9" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Candle glow */}
      <ellipse cx="358" cy="20" rx="22" ry="14" fill="#e07b39" opacity="0.06" />

      {/* Cobweb top-left corner */}
      <g opacity="0.35" stroke="#888" strokeWidth="0.7" fill="none">
        <line x1="18" y1="0" x2="48" y2="28" />
        <line x1="18" y1="0" x2="18" y2="28" />
        <line x1="18" y1="0" x2="38" y2="0" />
        <path d="M 18 8 Q 28 8 28 18" />
        <path d="M 18 16 Q 32 14 36 26" />
        <path d="M 23 0 Q 26 12 22 22" />
      </g>

      {/* Small skull on left of shelf 2 */}
      <g transform="translate(32, 72)" opacity="0.55">
        <ellipse cx="8" cy="7" rx="8" ry="7" fill="#d4cfc0" />
        <rect x="3" y="11" width="10" height="5" rx="1" fill="#c0bba8" />
        <circle cx="5" cy="7" r="2.5" fill="#1a1618" />
        <circle cx="11" cy="7" r="2.5" fill="#1a1618" />
        <rect x="5" y="14" width="2" height="3" fill="#1a1618" />
        <rect x="9" y="14" width="2" height="3" fill="#1a1618" />
      </g>

      {/* Small vial / empty bottle on shelf 2 right */}
      <g transform="translate(345, 70)" opacity="0.45">
        <rect x="4" y="0" width="5" height="3" rx="1" fill="#8a6040" />
        <rect x="4.5" y="3" width="4" height="6" rx="0.5" fill="#88aacc" opacity="0.6" />
        <rect x="3" y="9" width="7" height="14" rx="2" fill="#88aacc" opacity="0.4" />
      </g>
    </svg>
  )
}

export default function PotionShelf() {
  const { potionInventory } = useStore()

  const potions = Object.entries(potionInventory ?? {})
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ id, qty, ...POTION_MAP[id] }))
    .filter(p => p.name)

  return (
    <div className={styles.wrap}>
      <ShelfIllustration />

      <div className={styles.titleRow}>
        <span className={styles.title}>Potion Shelf</span>
        {potions.length > 0 && (
          <span className={styles.count}>{potions.length} type{potions.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {potions.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>The shelf is bare.</p>
          <p className="lore">Brew potions in the Recipes tab to stock it.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {potions.map(p => (
            <div key={p.id} className={styles.card}>
              <div className={styles.bottleWrap}>
                <Bottle color={p.color} />
                {p.qty > 1 && (
                  <span className={styles.qty} style={{ borderColor: p.color, color: p.color }}>
                    ×{p.qty}
                  </span>
                )}
              </div>
              <div className={styles.name}>{p.name}</div>
              {p.lore && <div className={styles.lore}>{p.lore}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
