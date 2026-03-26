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

function BoilingCauldron() {
  return (
    <div className={styles.cauldronWrap}>
      <svg viewBox="0 0 220 180" width="220" height="180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

        {/* === STEAM WISPS (float upward) === */}
        <g opacity="0.55">
          {/* Wisp left */}
          <path d="M 72 52 C 68 44 76 36 72 28 C 68 20 74 14 72 8" stroke="#c8a8e8" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="translate" values="0,0; -2,-6; 2,-12; 0,-18" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0.7;0.4;0" dur="2.4s" repeatCount="indefinite" />
          </path>
          {/* Wisp centre */}
          <path d="M 110 44 C 105 35 115 26 110 18 C 105 10 112 4 110 0" stroke="#d0b0f0" strokeWidth="3" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="translate" values="0,0; 3,-8; -2,-16; 0,-24" dur="2.0s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.75;0.4;0" dur="2.0s" repeatCount="indefinite" />
          </path>
          {/* Wisp right */}
          <path d="M 148 52 C 152 44 144 36 148 28 C 152 20 146 14 148 8" stroke="#b898d8" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="translate" values="0,0; 2,-6; -2,-12; 0,-18" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0.65;0.35;0" dur="2.8s" repeatCount="indefinite" />
          </path>
          {/* Extra wisp */}
          <path d="M 90 48 C 86 40 92 33 89 26 C 86 20 90 15 88 10" stroke="#e0c0f8" strokeWidth="2" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="translate" values="0,0; -1,-5; 1,-10; 0,-16" dur="3.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.6;0.3;0" dur="3.1s" repeatCount="indefinite" />
          </path>
        </g>

        {/* === LEGS === */}
        <rect x="74" y="148" width="10" height="22" rx="3" fill="#1e1428" />
        <rect x="136" y="148" width="10" height="22" rx="3" fill="#1e1428" />
        <rect x="105" y="152" width="10" height="18" rx="3" fill="#1e1428" />

        {/* === CAULDRON BODY === */}
        <ellipse cx="110" cy="120" rx="72" ry="36" fill="#1a1228" />
        <path d="M 38 100 Q 38 158 110 158 Q 182 158 182 100 Z" fill="#221830" />
        {/* Body highlight */}
        <path d="M 48 108 Q 50 148 110 150" stroke="#3a2850" strokeWidth="2" fill="none" opacity="0.6" />

        {/* === RIM === */}
        <ellipse cx="110" cy="100" rx="72" ry="22" fill="#2a1e3c" />
        <ellipse cx="110" cy="100" rx="68" ry="19" fill="#180f2a" />

        {/* === HANDLES === */}
        <path d="M 42 100 Q 22 88 26 74 Q 30 62 42 68" stroke="#2a1e3c" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 178 100 Q 198 88 194 74 Q 190 62 178 68" stroke="#2a1e3c" strokeWidth="7" fill="none" strokeLinecap="round" />

        {/* === LIQUID SURFACE (boiling wobble) === */}
        <ellipse cx="110" cy="100" rx="68" ry="18" fill="#3d1f6e">
          <animate attributeName="rx" values="68;66;70;67;68" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="ry" values="18;20;17;19;18" dur="1.6s" repeatCount="indefinite" />
        </ellipse>
        {/* Liquid shimmer */}
        <ellipse cx="110" cy="100" rx="68" ry="18" fill="url(#liquidGrad)" opacity="0.7">
          <animate attributeName="rx" values="68;66;70;67;68" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="ry" values="18;20;17;19;18" dur="1.6s" repeatCount="indefinite" />
        </ellipse>

        {/* === BUBBLES (rise from below surface) === */}
        {/* Bubble 1 */}
        <circle cx="88" cy="102" r="5" fill="#7c3fb8" opacity="0.85">
          <animate attributeName="cy" values="110;95;110" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.85;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* Bubble 2 */}
        <circle cx="118" cy="97" r="4" fill="#9b55d0" opacity="0.8">
          <animate attributeName="cy" values="108;92;108" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;5;2" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        {/* Bubble 3 */}
        <circle cx="100" cy="105" r="3.5" fill="#6630a0" opacity="0.75">
          <animate attributeName="cy" values="112;98;112" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;4.5;2" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.75;0" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        {/* Bubble 4 */}
        <circle cx="132" cy="103" r="4.5" fill="#8844c4" opacity="0.8">
          <animate attributeName="cy" values="110;95;110" dur="1.1s" begin="0.9s" repeatCount="indefinite" />
          <animate attributeName="r" values="2.5;5.5;2.5" dur="1.1s" begin="0.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="1.1s" begin="0.9s" repeatCount="indefinite" />
        </circle>
        {/* Bubble 5 small */}
        <circle cx="110" cy="100" r="3" fill="#c090f0" opacity="0.6">
          <animate attributeName="cy" values="106;94;106" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;3.5;1.5" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
        </circle>

        {/* === LIQUID GLOW REFLECTION === */}
        <ellipse cx="96" cy="98" rx="18" ry="6" fill="white" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.1;0.06" dur="1.8s" repeatCount="indefinite" />
        </ellipse>

        {/* === FIRE / EMBERS UNDER CAULDRON === */}
        <g transform="translate(110, 162)">
          {/* Flame centre */}
          <ellipse cx="0" cy="0" rx="20" ry="10" fill="#e05820" opacity="0.75">
            <animate attributeName="rx" values="20;16;22;18;20" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="ry" values="10;13;9;12;10" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.75;0.9;0.65;0.8;0.75" dur="0.7s" repeatCount="indefinite" />
          </ellipse>
          {/* Flame inner */}
          <ellipse cx="0" cy="-2" rx="11" ry="7" fill="#f4a030" opacity="0.85">
            <animate attributeName="rx" values="11;8;13;10;11" dur="0.55s" repeatCount="indefinite" />
            <animate attributeName="ry" values="7;9;6;8;7" dur="0.55s" repeatCount="indefinite" />
          </ellipse>
          {/* Flame tip */}
          <ellipse cx="0" cy="-5" rx="5" ry="4" fill="#fce060" opacity="0.9">
            <animate attributeName="ry" values="4;6;3;5;4" dur="0.45s" repeatCount="indefinite" />
          </ellipse>
          {/* Ember sparks */}
          <circle cx="-14" cy="-2" r="2" fill="#f06030" opacity="0.7">
            <animate attributeName="cy" values="-2;-8;-2" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="14" cy="-3" r="1.5" fill="#f08040" opacity="0.65">
            <animate attributeName="cy" values="-3;-9;-3" dur="0.65s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.65;0;0.65" dur="0.65s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === GRADIENT DEFS === */}
        <defs>
          <radialGradient id="liquidGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c090ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3d1f6e" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function RecipeBook() {
  const [selectedPotion, setSelectedPotion] = useState(null)
  const { cauldronTier, inventory, potionInventory } = useStore()

  return (
    <>
      <BoilingCauldron />
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
