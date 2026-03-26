import { useStore } from '../../store/index.js'
import { INGOTS, INGOT_MAP, ORE_MAP } from '../../constants/ores.js'
import { CAULDRON_UPGRADES, ALEMBIC } from '../../constants/shop.js'
import Timer from '../ui/Timer.jsx'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './SmithyTab.module.css'

function formatTime(s) {
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const STONE_ROWS = [
  { y: 0,   h: 16, off: 0  },
  { y: 16,  h: 16, off: 30 },
  { y: 32,  h: 16, off: 0  },
  { y: 48,  h: 16, off: 30 },
  { y: 64,  h: 16, off: 0  },
  { y: 80,  h: 16, off: 30 },
  { y: 96,  h: 16, off: 0  },
  { y: 112, h: 16, off: 30 },
  { y: 128, h: 16, off: 0  },
  { y: 144, h: 16, off: 30 },
]
const STONE_COLORS = ['#2d2622', '#2a2420', '#2f2824']

function WorkshopSmithy() {
  return (
    <svg viewBox="0 0 360 220" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sForgeGlow" cx="55%" cy="85%" r="45%">
          <stop offset="0%" stopColor="#ff5500" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff3300" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sFloorGlow" cx="55%" cy="10%" r="70%">
          <stop offset="0%" stopColor="#cc3300" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#cc3300" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Stone wall */}
      <rect width="360" height="164" fill="#221e1b" />
      {STONE_ROWS.map((row, ri) =>
        Array.from({ length: 9 }, (_, i) => {
          const x = i * 48 - row.off
          return (
            <rect key={`s${ri}${i}`}
              x={x} y={row.y} width="46" height={row.h - 1}
              rx="1"
              fill={STONE_COLORS[ri % 3]}
              stroke="#181512" strokeWidth="0.5"
            />
          )
        })
      )}
      {/* Forge glow on wall */}
      <rect width="360" height="164" fill="url(#sForgeGlow)" />

      {/* Ceiling beam */}
      <rect x="0" y="0" width="360" height="20" fill="#3c2d1c" />
      {[15, 55, 95, 135, 175, 215, 255, 295, 335].map(x => (
        <line key={x} x1={x} y1="0" x2={x + 4} y2="20" stroke="#281d0e" strokeWidth="1" opacity="0.5" />
      ))}
      <rect x="0" y="18" width="360" height="3" fill="#281d0e" />

      {/* Floor planks */}
      <rect x="0" y="162" width="360" height="58" fill="#291d12" />
      {[0, 55, 110, 165, 220, 275, 330].map(x => (
        <line key={x} x1={x} y1="162" x2={x} y2="220" stroke="#1c1208" strokeWidth="1.5" />
      ))}
      {[172, 186, 200, 213].map(y => (
        <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#1c1208" strokeWidth="0.4" opacity="0.5" />
      ))}
      <rect x="0" y="162" width="360" height="58" fill="url(#sFloorGlow)" />

      {/* === FORGE === */}
      {/* Chimney pipe */}
      <rect x="163" y="20" width="34" height="44" fill="#2c2318" stroke="#1c1510" strokeWidth="1" />
      <line x1="163" y1="32" x2="197" y2="32" stroke="#1c1510" strokeWidth="0.5" opacity="0.5" />
      <line x1="163" y1="48" x2="197" y2="48" stroke="#1c1510" strokeWidth="0.5" opacity="0.5" />
      {[[166,28],[166,44],[193,28],[193,44]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="#1a1208" />
      ))}

      {/* Hood/mantle */}
      <polygon points="128,64 232,64 218,100 142,100" fill="#38291a" stroke="#22170a" strokeWidth="1" />
      <line x1="180" y1="64" x2="180" y2="100" stroke="#22170a" strokeWidth="0.5" opacity="0.6" />

      {/* Forge body bricks */}
      <rect x="142" y="100" width="76" height="62" fill="#302419" />
      {[100, 113, 126, 139, 152].map((by, ri) =>
        [-1, 0, 1, 2].map(bi => {
          const bx = 142 + bi * 26 - (ri % 2 === 0 ? 0 : 13)
          if (bx + 24 < 142 || bx > 218) return null
          return (
            <rect key={`fb${ri}${bi}`}
              x={Math.max(142, bx)} y={by}
              width={Math.min(24, 218 - Math.max(142, bx))} height="12"
              rx="0.5"
              fill={ri % 2 === 0 ? '#362a1c' : '#3c2e20'}
              stroke="#22170a" strokeWidth="0.5"
            />
          )
        })
      )}

      {/* Arch opening */}
      <path d="M155,162 L155,133 Q180,110 205,133 L205,162 Z" fill="#150800" />
      <path d="M155,133 Q180,110 205,133" fill="none" stroke="#352212" strokeWidth="2.5" />

      {/* Fire base glow */}
      <ellipse cx="180" cy="158" rx="24" ry="6" fill="#aa3300" opacity="0.9">
        <animate attributeName="rx" values="24;27;22;25;24" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.7;1.0;0.8;0.9" dur="0.9s" repeatCount="indefinite" />
      </ellipse>
      {/* Outer flame */}
      <ellipse cx="180" cy="148" rx="18" ry="14" fill="#cc4400" opacity="0.85">
        <animate attributeName="ry" values="14;18;11;16;14" dur="0.7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="180;177;183;179;180" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85;0.65;0.9;0.75;0.85" dur="0.7s" repeatCount="indefinite" />
      </ellipse>
      {/* Mid flame */}
      <ellipse cx="180" cy="140" rx="13" ry="16" fill="#e86000" opacity="0.9">
        <animate attributeName="ry" values="16;20;13;18;16" dur="0.55s" repeatCount="indefinite" />
        <animate attributeName="cx" values="180;183;177;181;180" dur="0.65s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner flame */}
      <ellipse cx="180" cy="132" rx="8" ry="18" fill="#f09000" opacity="0.9">
        <animate attributeName="ry" values="18;22;15;20;18" dur="0.45s" repeatCount="indefinite" />
        <animate attributeName="cx" values="180;178;182;180;180" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Core */}
      <ellipse cx="180" cy="126" rx="4" ry="12" fill="#ffe060" opacity="0.95">
        <animate attributeName="ry" values="12;16;10;14;12" dur="0.38s" repeatCount="indefinite" />
      </ellipse>

      {/* Ember sparks */}
      {[
        { cx: 172, delay: '0s',    dur: '1.1s' },
        { cx: 180, delay: '0.35s', dur: '1.4s' },
        { cx: 175, delay: '0.7s',  dur: '0.95s' },
        { cx: 185, delay: '0.15s', dur: '1.25s' },
        { cx: 168, delay: '0.55s', dur: '1.0s'  },
      ].map((em, i) => (
        <circle key={i} cx={em.cx} r="1.5" fill="#ff8800">
          <animate attributeName="cy" values="138;105;88" dur={em.dur} begin={em.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.7;0" dur={em.dur} begin={em.delay} repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;1;0.3" dur={em.dur} begin={em.delay} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Smoke from chimney */}
      {[
        { x: 174, delay: '0s',    dur: '2.2s' },
        { x: 182, delay: '0.75s', dur: '2.8s' },
        { x: 178, delay: '1.5s',  dur: '2.5s' },
      ].map((sm, i) => (
        <ellipse key={i} cx={sm.x} cy="19" rx="5" ry="6" fill="#3a2e24">
          <animate attributeName="cy" values="19;10;2" dur={sm.dur} begin={sm.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.55;0" dur={sm.dur} begin={sm.delay} repeatCount="indefinite" />
          <animate attributeName="rx" values="5;8;12" dur={sm.dur} begin={sm.delay} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* === ANVIL === */}
      {/* Horn */}
      <path d="M52,147 L52,153 Q65,153 76,147 Z" fill="#504c46" stroke="#282422" strokeWidth="1" />
      {/* Top face */}
      <rect x="72" y="135" width="54" height="14" rx="2" fill="#545048" stroke="#282422" strokeWidth="1" />
      {/* Shine */}
      <rect x="74" y="135" width="50" height="3" rx="1" fill="#706c64" opacity="0.45" />
      {/* Waist */}
      <path d="M80,149 L78,158 L121,158 L119,149" fill="#3e3a34" stroke="#282422" strokeWidth="0.5" />
      {/* Base */}
      <rect x="76" y="158" width="48" height="7" rx="1" fill="#3c3830" stroke="#282422" strokeWidth="1" />

      {/* Hammer on anvil */}
      <g transform="translate(96,115) rotate(-15)">
        <rect x="-3" y="0" width="6" height="32" rx="2" fill="#5c3c1c" stroke="#3a2010" strokeWidth="0.5" />
        <rect x="-10" y="-3" width="20" height="10" rx="2" fill="#585250" stroke="#282422" strokeWidth="1" />
        <rect x="-9" y="-3" width="18" height="3" rx="1" fill="#787270" opacity="0.35" />
      </g>

      {/* === TOOL RACK (left wall) === */}
      <rect x="8" y="48" width="58" height="7" rx="1" fill="#4e3422" stroke="#2e1e0e" strokeWidth="1" />
      {[15, 30, 45, 60].map(x => (
        <line key={x} x1={x} y1="48" x2={x + 2} y2="55" stroke="#2e1e0e" strokeWidth="0.5" opacity="0.4" />
      ))}
      {[20, 37, 54].map(x => (
        <rect key={x} x={x - 2} y="55" width="4" height="9" rx="1" fill="#2e1e0e" />
      ))}
      {/* Tongs */}
      <line x1="18" y1="64" x2="15" y2="88" stroke="#5a5550" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="64" x2="25" y2="88" stroke="#5a5550" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="72" r="2" fill="#3a3630" stroke="#5a5550" strokeWidth="0.5" />
      <line x1="14" y1="88" x2="18" y2="86" stroke="#5a5550" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="86" x2="26" y2="88" stroke="#5a5550" strokeWidth="3" strokeLinecap="round" />
      {/* Hanging hammer */}
      <line x1="37" y1="64" x2="37" y2="85" stroke="#5c3c1c" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="83" width="14" height="8" rx="1.5" fill="#585250" stroke="#282422" strokeWidth="0.5" />
      {/* File/chisel */}
      <line x1="54" y1="64" x2="54" y2="92" stroke="#5a5550" strokeWidth="2" strokeLinecap="round" />
      <rect x="50" y="90" width="8" height="5" rx="0.5" fill="#484440" />

      {/* === COAL PILE (bottom left) === */}
      <ellipse cx="52" cy="196" rx="42" ry="12" fill="#140f0a" opacity="0.7" />
      <ellipse cx="36" cy="190" rx="14" ry="10" fill="#201a14" />
      <ellipse cx="52" cy="186" rx="16" ry="12" fill="#241e18" />
      <ellipse cx="66" cy="188" rx="12" ry="9" fill="#1e1814" />
      <ellipse cx="44" cy="183" rx="8" ry="6" fill="#281f18" />
      <ellipse cx="62" cy="183" rx="7" ry="5" fill="#241b15" />
      {/* Glowing embers in coal */}
      <ellipse cx="40" cy="188" rx="3.5" ry="2.5" fill="#8a2200" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.9;0.5;0.8" dur="1.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="58" cy="185" rx="3" ry="2" fill="#9c3100" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1.0;0.4;0.85;0.7" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="50" cy="182" rx="2.5" ry="1.5" fill="#7a1e00" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.9;0.3;0.7;0.6" dur="2.0s" repeatCount="indefinite" />
      </ellipse>

      {/* === INGOT STACK (bottom right) === */}
      {[
        { y: 196, fill: '#6a4010', stroke: '#3a2008' },
        { y: 189, fill: '#8a5618', stroke: '#4a2e08' },
        { y: 182, fill: '#a87a30', stroke: '#5a3e10' },
        { y: 175, fill: '#c8983a', stroke: '#6a4e18' },
      ].map((ig, i) => (
        <g key={i}>
          <rect x={278 + i} y={ig.y} width="56" height="10" rx="2" fill={ig.fill} stroke={ig.stroke} strokeWidth="0.5" />
          <rect x={280 + i} y={ig.y + 1} width="52" height="2.5" rx="1" fill="#ffffff" opacity="0.1" />
        </g>
      ))}
      <rect x="280" y="175" width="52" height="2.5" rx="1" fill="#e8c060" opacity="0.25" />

      {/* === HANGING CHAIN + BUCKET (upper right) === */}
      {[0, 5, 10, 15, 20, 25, 30].map(dy => (
        <ellipse key={dy} cx="295" cy={22 + dy} rx="3" ry="2" fill="none" stroke="#4a3830" strokeWidth="1.5" />
      ))}
      {/* Bucket */}
      <path d="M289,53 L287,68 L303,68 L301,53 Z" fill="#4a3820" stroke="#2a2010" strokeWidth="1" />
      <line x1="289" y1="54" x2="301" y2="54" stroke="#3a2810" strokeWidth="1.5" />
      {/* Water in bucket */}
      <ellipse cx="295" cy="66" rx="7" ry="2.5" fill="#1e3d5a" opacity="0.75" />
      <line x1="289" y1="65" x2="301" y2="65" stroke="#2e5a8a" strokeWidth="0.5" opacity="0.6" />
    </svg>
  )
}

export default function SmithyTab() {
  const { oreInventory, ingotInventory, smithing, startSmelt, startForge, level, owned } = useStore()
  const activeSmelt = smithing?.filter(s => s.type === 'smelt') ?? []
  const activeForge = smithing?.filter(s => s.type === 'forge') ?? []

  const handleSmelt = (ingot) => {
    const result = startSmelt(ingot.id, 1)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Smelting ${ingot.name}...`, 'success')
  }

  const handleForge = (upgrade) => {
    const result = startForge(upgrade.id)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Forging ${upgrade.name}...`, 'success')
  }

  return (
    <div className={styles.smithy}>
      {/* Forge illustration */}
      <div className={styles.smithyWrap}>
        <WorkshopSmithy />
      </div>

      {/* Active smelts */}
      {activeSmelt.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Smelting</div>
          {activeSmelt.map(s => {
            const ingot = INGOT_MAP[s.itemId]
            const elapsed = Date.now() - s.startedAt
            return (
              <div key={s.id} className={styles.activeItem}>
                <span className={styles.itemName}>{ingot?.name ?? s.itemId}</span>
                <ProgressBar value={Math.min(1, elapsed / s.totalTime)} color="ember" height={4} />
                <Timer finishAt={s.finishAt} compact />
              </div>
            )
          })}
        </div>
      )}

      {/* Smelt recipes */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Smelt Ore</div>
        {INGOTS.map(ingot => {
          const oreCount = oreInventory?.[ingot.fromOre] ?? 0
          const canSmelt = oreCount >= ingot.ratio
          return (
            <div key={ingot.id} className={styles.smeltRow}>
              <div className={styles.smeltInfo}>
                <span className={styles.ingotName} style={{ color: ingot.color }}>{ingot.name}</span>
                <span className={styles.smeltRecipe}>
                  {ORE_MAP[ingot.fromOre]?.name} ×{ingot.ratio} → 1 ingot · {formatTime(ingot.smeltTime)}
                </span>
                <span className={styles.smeltHave}>Have: {oreCount} ore, {ingotInventory?.[ingot.id] ?? 0} ingots</span>
              </div>
              <Button variant="ember" size="sm" disabled={!canSmelt} onClick={() => handleSmelt(ingot)}>
                Smelt
              </Button>
            </div>
          )
        })}
      </div>

      {/* Forge upgrades */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Forge</div>
        {[...CAULDRON_UPGRADES, ALEMBIC].map(upgrade => {
          const alreadyForged = owned?.includes(upgrade.id)
          const isForging = activeForge.some(s => s.itemId === upgrade.id)
          const reqMet = level >= upgrade.unlockLevel
          return (
            <div key={upgrade.id} className={`${styles.forgeRow} ${alreadyForged ? styles.forged : ''}`}>
              <div className={styles.forgeInfo}>
                <span className={styles.forgeName}>{upgrade.name}</span>
                <span className={styles.forgeDesc}>{upgrade.description}</span>
                <span className={styles.forgeReq}>
                  {Object.entries(upgrade.recipe).map(([id, qty]) => `${id} ×${qty}`).join(' + ')} + {upgrade.goldCost}g · Lv.{upgrade.unlockLevel}
                </span>
              </div>
              {alreadyForged ? (
                <span className={styles.forgedLabel}>Forged</span>
              ) : isForging ? (
                <span className={styles.forgingLabel}>Forging...</span>
              ) : (
                <Button variant="ghost" size="sm" disabled={!reqMet} onClick={() => handleForge(upgrade)}>
                  Forge
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
