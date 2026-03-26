import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { POTIONS } from '../../constants/potions.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { BUG_MAP } from '../../constants/bugs.js'
import BrewModal from './BrewModal.jsx'
import styles from './RecipeBook.module.css'

function getItemName(id) {
  return HERB_MAP[id]?.name ?? MUSHROOM_MAP[id]?.name ?? BUG_MAP[id]?.name ?? id
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const STONE_ROWS = [14, 34, 54, 74, 94, 114, 134, 154, 174]
const STONE_COLS = [0, 46, 92, 138, 184, 230, 276, 322]

function WorkshopCauldron() {
  return (
    <div className={styles.cauldronWrap}>
      <svg viewBox="0 0 360 230" width="100%" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="wsFireGlow" cx="50%" cy="90%" r="50%">
            <stop offset="0%" stopColor="#e06020" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#e06020" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wsTorchGlow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#f0a040" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f0a040" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wsLiquid" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c090ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3d1f6e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── WALL BACKGROUND ── */}
        <rect width="360" height="230" fill="#0d0a13" />

        {/* ── STONE BLOCKS ── */}
        {STONE_ROWS.map((y, row) =>
          STONE_COLS.map((x, col) => (
            <rect
              key={`s${row}-${col}`}
              x={row % 2 === 0 ? x : x + 23}
              y={y}
              width="43"
              height="19"
              fill="none"
              stroke="#1c1526"
              strokeWidth="1"
              rx="0.5"
            />
          ))
        )}

        {/* ── CEILING BEAM ── */}
        <rect x="0" y="0" width="360" height="14" fill="#2a1c0c" />
        {[20, 65, 115, 162, 208, 255, 302, 346].map((x, i) => (
          <line key={`bg${i}`} x1={x} y1="2" x2={x + 8} y2="13" stroke="#3a2810" strokeWidth="1" opacity="0.6" />
        ))}

        {/* ── FLOOR ── */}
        <rect x="0" y="193" width="360" height="37" fill="#18100a" />
        {[193, 203, 213, 223].map((y, i) => (
          <rect key={`fp${i}`} x="0" y={y} width="360" height="9" fill="none" stroke="#241608" strokeWidth="1" />
        ))}
        {[55, 135, 215, 295].map((x, i) => (
          <line key={`fj${i}`} x1={x} y1="193" x2={x + 5} y2="230" stroke="#241608" strokeWidth="1" opacity="0.45" />
        ))}
        {/* wall-floor shadow */}
        <rect x="0" y="188" width="360" height="10" fill="#0d0a13" opacity="0.4" />

        {/* ── AMBIENT GLOWS ── */}
        {/* Torch glow on right wall */}
        <ellipse cx="308" cy="66" rx="62" ry="62" fill="url(#wsTorchGlow)" />
        {/* Fire glow on floor */}
        <ellipse cx="180" cy="216" rx="78" ry="20" fill="url(#wsFireGlow)" />

        {/* ── LEFT SHELF ── */}
        {/* Bracket */}
        <polygon points="63,90 63,116 51,116" fill="#2a1808" opacity="0.95" />
        {/* Shelf plank top + face */}
        <rect x="0" y="82" width="67" height="7" fill="#3a2810" rx="1" />
        <rect x="0" y="87" width="67" height="2" fill="#221408" />
        {/* Bottle 1 — red */}
        <g transform="translate(5,60)">
          <rect x="3" y="0" width="6" height="3" rx="1" fill="#5a3820" />
          <rect x="3" y="3" width="5.5" height="5" rx="0.5" fill="#cc4040" opacity="0.75" />
          <rect x="1" y="8" width="10" height="14" rx="3" fill="#cc4040" opacity="0.62" />
          <rect x="2" y="12" width="3" height="7" rx="1.5" fill="white" opacity="0.13" />
        </g>
        {/* Bottle 2 — green */}
        <g transform="translate(22,57)">
          <rect x="3" y="0" width="5" height="3" rx="1" fill="#5a3820" />
          <rect x="3" y="3" width="4.5" height="5" rx="0.5" fill="#40aa60" opacity="0.7" />
          <rect x="1" y="8" width="9" height="17" rx="3" fill="#40aa60" opacity="0.58" />
          <rect x="2" y="12" width="2.5" height="8" rx="1.2" fill="white" opacity="0.13" />
        </g>
        {/* Bottle 3 — blue */}
        <g transform="translate(38,62)">
          <rect x="3" y="0" width="5" height="3" rx="1" fill="#5a3820" />
          <rect x="3" y="3" width="4.5" height="4" rx="0.5" fill="#4060cc" opacity="0.7" />
          <rect x="1" y="7" width="9" height="13" rx="3" fill="#4060cc" opacity="0.58" />
          <rect x="2" y="10" width="2.5" height="6" rx="1.2" fill="white" opacity="0.13" />
        </g>

        {/* ── WALL TORCH (right) ── */}
        {/* Wall bracket arm */}
        <rect x="294" y="60" width="18" height="4" rx="2" fill="#3a2810" />
        {/* Vertical mount */}
        <rect x="303" y="44" width="4" height="18" rx="2" fill="#3a2810" />
        {/* Torch body */}
        <rect x="301" y="33" width="8" height="13" rx="2" fill="#6a4820" />
        {/* Wrapping band */}
        <rect x="300" y="33" width="10" height="5" rx="1" fill="#8a6030" opacity="0.7" />
        {/* Flames */}
        <ellipse cx="305" cy="29" rx="7" ry="9" fill="#e06820" opacity="0.8">
          <animate attributeName="rx" values="7;5;8;6;7" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="ry" values="9;11;8;10;9" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="305" cy="27" rx="4" ry="6" fill="#f4a030" opacity="0.9">
          <animate attributeName="rx" values="4;3;5;3.5;4" dur="0.65s" repeatCount="indefinite" />
          <animate attributeName="ry" values="6;8;5;7;6" dur="0.65s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="305" cy="25" rx="2" ry="3" fill="#fce060" opacity="0.95">
          <animate attributeName="ry" values="3;5;2;4;3" dur="0.5s" repeatCount="indefinite" />
        </ellipse>

        {/* ── HANGING HERB BUNDLES ── */}
        {/* Bundle 1 */}
        <line x1="222" y1="14" x2="222" y2="37" stroke="#7a6030" strokeWidth="1.5" />
        <ellipse cx="222" cy="40" rx="5" ry="3.5" fill="#4a6830" opacity="0.8" />
        <line x1="222" y1="28" x2="214" y2="41" stroke="#5a7838" strokeWidth="1" opacity="0.7" />
        <line x1="222" y1="28" x2="230" y2="41" stroke="#5a7838" strokeWidth="1" opacity="0.7" />
        <line x1="222" y1="23" x2="216" y2="35" stroke="#4a6830" strokeWidth="1" opacity="0.5" />
        {/* Bundle 2 */}
        <line x1="243" y1="14" x2="243" y2="32" stroke="#7a6030" strokeWidth="1.5" />
        <ellipse cx="243" cy="35" rx="4" ry="3" fill="#506830" opacity="0.75" />
        <line x1="243" y1="24" x2="236" y2="36" stroke="#5a7838" strokeWidth="1" opacity="0.65" />
        <line x1="243" y1="24" x2="250" y2="36" stroke="#5a7838" strokeWidth="1" opacity="0.65" />
        {/* Bundle 3 */}
        <line x1="264" y1="14" x2="264" y2="39" stroke="#7a6030" strokeWidth="1.5" />
        <ellipse cx="264" cy="43" rx="5.5" ry="3.5" fill="#5a7030" opacity="0.8" />
        <line x1="264" y1="28" x2="255" y2="43" stroke="#5a7838" strokeWidth="1" opacity="0.7" />
        <line x1="264" y1="28" x2="273" y2="43" stroke="#5a7838" strokeWidth="1" opacity="0.7" />
        <line x1="264" y1="22" x2="257" y2="34" stroke="#4a6830" strokeWidth="1" opacity="0.5" />

        {/* ── STIRRING SPOON (leaning on right side of cauldron) ── */}
        <line x1="238" y1="88" x2="222" y2="182" stroke="#5a3c18" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        {/* Spoon bowl */}
        <ellipse cx="220" cy="184" rx="7" ry="4" fill="#6a4820" opacity="0.8" />

        {/* ── COBWEB (top-left corner) ── */}
        <g opacity="0.28" stroke="#9a88b0" strokeWidth="0.8" fill="none">
          <line x1="0" y1="14" x2="32" y2="42" />
          <line x1="0" y1="14" x2="0" y2="44" />
          <line x1="0" y1="14" x2="30" y2="14" />
          <path d="M 0 22 Q 14 20 16 33" />
          <path d="M 0 31 Q 21 27 25 40" />
          <path d="M 10 14 Q 14 27 11 38" />
        </g>

        {/* ── STONE HEARTH ── */}
        <rect x="124" y="190" width="112" height="18" rx="3" fill="#1c1428" />
        {/* Stone joints */}
        <rect x="124" y="190" width="52" height="18" fill="#211c30" stroke="#1a1628" strokeWidth="1" />
        <rect x="178" y="190" width="58" height="18" fill="#1e1830" stroke="#1a1628" strokeWidth="1" />
        {/* Top edge highlight */}
        <rect x="124" y="190" width="112" height="3" rx="1.5" fill="#2c2040" opacity="0.55" />

        {/* ── CAULDRON LEGS ── */}
        <rect x="147" y="181" width="8" height="11" rx="2.5" fill="#16101c" />
        <rect x="205" y="181" width="8" height="11" rx="2.5" fill="#16101c" />
        <rect x="176" y="184" width="8" height="8" rx="2.5" fill="#16101c" />

        {/* ── CAULDRON BODY ── */}
        <ellipse cx="180" cy="157" rx="52" ry="26" fill="#14101a" />
        <path d="M 128 137 Q 128 181 180 181 Q 232 181 232 137 Z" fill="#1a1226" />
        {/* Body highlight curve */}
        <path d="M 138 146 Q 140 175 180 177" stroke="#2a1e3c" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* ── RIM ── */}
        <ellipse cx="180" cy="137" rx="52" ry="15" fill="#1e1436" />
        <ellipse cx="180" cy="137" rx="49" ry="13" fill="#11091c" />

        {/* ── HANDLES ── */}
        <path d="M 132 137 Q 116 127 119 117 Q 122 108 132 112" stroke="#1e1436" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 228 137 Q 244 127 241 117 Q 238 108 228 112" stroke="#1e1436" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* ── LIQUID SURFACE (boiling wobble) ── */}
        <ellipse cx="180" cy="137" rx="49" ry="12" fill="#3d1f6e">
          <animate attributeName="rx" values="49;47;51;48;49" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="ry" values="12;14;11;13;12" dur="1.6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="180" cy="137" rx="49" ry="12" fill="url(#wsLiquid)" opacity="0.7">
          <animate attributeName="rx" values="49;47;51;48;49" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="ry" values="12;14;11;13;12" dur="1.6s" repeatCount="indefinite" />
        </ellipse>

        {/* ── BUBBLES ── */}
        <circle cx="163" cy="139" r="4" fill="#7c3fb8">
          <animate attributeName="cy" values="147;131;147" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;5;2" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.85;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="189" cy="134" r="3.5" fill="#9b55d0">
          <animate attributeName="cy" values="144;127;144" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;4.5;1.5" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="173" cy="141" r="3" fill="#6630a0">
          <animate attributeName="cy" values="147;133;147" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;4;1.5" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.75;0" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="197" cy="138" r="4" fill="#8844c4">
          <animate attributeName="cy" values="145;130;145" dur="1.1s" begin="0.9s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;5;2" dur="1.1s" begin="0.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="1.1s" begin="0.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="137" r="2.5" fill="#c090f0">
          <animate attributeName="cy" values="142;129;142" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.2;3;1.2" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
        </circle>

        {/* ── LIQUID REFLECTION ── */}
        <ellipse cx="167" cy="135" rx="14" ry="5" fill="white" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.10;0.06" dur="1.8s" repeatCount="indefinite" />
        </ellipse>

        {/* ── HEARTH FIRE ── */}
        <g transform="translate(180,192)">
          <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e05820" opacity="0.7">
            <animate attributeName="rx" values="26;21;28;23;26" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="ry" values="8;10;7;9;8" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.88;0.6;0.76;0.7" dur="0.7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="-4" rx="15" ry="10" fill="#f4a030" opacity="0.85">
            <animate attributeName="rx" values="15;11;17;13;15" dur="0.55s" repeatCount="indefinite" />
            <animate attributeName="ry" values="10;12;9;11;10" dur="0.55s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="-9" rx="7" ry="7" fill="#fce060" opacity="0.9">
            <animate attributeName="ry" values="7;9;6;8;7" dur="0.45s" repeatCount="indefinite" />
            <animate attributeName="rx" values="7;5;8;6;7" dur="0.45s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="-17" cy="-2" r="2" fill="#f06030" opacity="0.7">
            <animate attributeName="cy" values="-2;-11;-2" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="17" cy="-3" r="1.5" fill="#f08040" opacity="0.65">
            <animate attributeName="cy" values="-3;-12;-3" dur="0.65s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.65;0;0.65" dur="0.65s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ── STEAM WISPS ── */}
        <path d="M 156 118 C 152 110 159 102 155 94 C 151 87 156 81 154 75" stroke="#c8a8e8" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0; -2,-6; 2,-12; 0,-18" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0.7;0.4;0" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M 180 112 C 175 103 184 94 179 86 C 174 79 180 73 178 67" stroke="#d0b0f0" strokeWidth="3" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0; 3,-8; -2,-16; 0,-24" dur="2.0s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.75;0.4;0" dur="2.0s" repeatCount="indefinite" />
        </path>
        <path d="M 204 118 C 208 110 201 102 205 94 C 209 87 204 81 206 75" stroke="#b898d8" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0; 2,-6; -2,-12; 0,-18" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0.65;0.35;0" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M 168 116 C 164 108 170 101 167 94 C 164 88 168 83 166 78" stroke="#e0c0f8" strokeWidth="2" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0; -1,-5; 1,-10; 0,-16" dur="3.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0.6;0.3;0" dur="3.1s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  )
}

export default function RecipeBook() {
  const [selectedPotion, setSelectedPotion] = useState(null)
  const { cauldronTier, inventory, potionInventory } = useStore()

  return (
    <>
      <WorkshopCauldron />
      <div className={styles.list}>
        {POTIONS.map(potion => {
          const locked = potion.cauldronTier > cauldronTier
          const inv = inventory ?? {}
          const canBrew = !locked && Object.entries(potion.ingredients).every(([id, qty]) => (inv[id] ?? 0) >= qty)
          const inInventory = potionInventory?.[potion.id] ?? 0

          return (
            <div
              key={potion.id}
              className={`${styles.recipe} ${locked ? styles.locked : ''} ${canBrew ? styles.canBrew : ''}`}
              onClick={() => !locked && setSelectedPotion(potion)}
            >
              <div className={styles.potionDot} style={{ background: potion.color }} />
              <div className={styles.info}>
                <div className={styles.topRow}>
                  <span className={styles.name}>{locked ? '???' : potion.name}</span>
                  {inInventory > 0 && <span className={styles.stock}>×{inInventory}</span>}
                </div>
                {!locked && (
                  <>
                    <div className={styles.ingredients}>
                      {Object.entries(potion.ingredients).map(([id, qty]) => (
                        <span
                          key={id}
                          className={`${styles.ing} ${(inv[id] ?? 0) >= qty ? styles.ingHave : styles.ingMissing}`}
                        >
                          {getItemName(id)} ×{qty}
                        </span>
                      ))}
                    </div>
                    <div className={styles.meta}>
                      <span className={styles.time}>⏱ {formatTime(potion.brewTime)}</span>
                      <span className={styles.xp}>+{potion.xpReward} XP</span>
                    </div>
                  </>
                )}
                {locked && (
                  <span className={styles.lockLabel}>Requires Tier {potion.cauldronTier} Cauldron</span>
                )}
              </div>
              {!locked && canBrew && <span className={styles.brewIcon}>🔥</span>}
            </div>
          )
        })}
      </div>
      {selectedPotion && (
        <BrewModal potion={selectedPotion} onClose={() => setSelectedPotion(null)} />
      )}
    </>
  )
}
