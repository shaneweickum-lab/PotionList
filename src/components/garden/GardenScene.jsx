import { useStore } from '../../store/index.js'
import PlotSlot from './PlotSlot.jsx'
import styles from './GardenScene.module.css'

// Deterministic star positions: [cx, cy, r, opacity, animDur]
const STARS = [
  [18,  6, 1.2, 0.85, 2.8], [52, 14, 0.7, 0.55, 3.2], [86,  8, 0.9, 0.70, 2.5],
  [118, 22, 0.6, 0.45, 4.1], [144, 10, 1.3, 0.90, 2.2], [172, 17, 0.8, 0.60, 3.8],
  [198,  5, 1.0, 0.75, 2.0], [228, 20, 0.7, 0.50, 4.5], [252, 11, 1.2, 0.85, 3.0],
  [278,  7, 0.6, 0.40, 2.7], [304, 18, 0.9, 0.65, 3.5], [328,  9, 1.1, 0.80, 2.3],
  [42, 30, 0.5, 0.30, 5.0],  [96, 34, 0.6, 0.25, 4.2], [158, 28, 0.5, 0.30, 3.9],
  [212, 35, 0.6, 0.22, 5.5], [268, 30, 0.5, 0.28, 4.8], [322, 27, 0.6, 0.32, 3.7],
  [350, 14, 1.0, 0.70, 2.6], [62, 42, 0.4, 0.20, 6.0], [185, 42, 0.4, 0.18, 5.8],
]

export default function GardenScene() {
  const { garden, owned } = useStore()
  const hasPath       = owned?.includes('stone_path')
  const hasLamp       = owned?.includes('moonlamp')
  const hasRack       = owned?.includes('herb_rack')
  const hasGreenhouse = owned?.includes('greenhouse')

  return (
    <div className={styles.scene}>
      <svg className={styles.svgBg} viewBox="0 0 430 170" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Sky: deep navy → dusk purple → warm amber horizon */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0a1225" />
            <stop offset="55%"  stopColor="#1a1640" />
            <stop offset="100%" stopColor="#2e1c12" />
          </linearGradient>
          {/* Ground: rich dark earth */}
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a1a08" />
            <stop offset="100%" stopColor="#180e04" />
          </linearGradient>
          {/* Moon core glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8d8" stopOpacity="0.35" />
            <stop offset="60%"  stopColor="#e8d060" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
          </radialGradient>
          {/* Moon lamp glow */}
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe0a0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e07b39" stopOpacity="0" />
          </radialGradient>
          {/* Blur for halos */}
          <filter id="haloBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="lampBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="430" height="170" fill="url(#skyGrad)" />

        {/* Stars with SVG twinkle animation */}
        {STARS.map(([cx, cy, r, op, dur], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#e8d880">
            <animate attributeName="opacity"
              values={`${op};${(op * 0.3).toFixed(2)};${op}`}
              dur={`${dur}s`}
              begin={`${(i * 0.37) % dur}s`}
              repeatCount="indefinite" />
          </circle>
        ))}

        {/* Moon halo */}
        <circle cx="370" cy="32" r="32" fill="url(#moonGlow)" filter="url(#haloBlur)" />
        {/* Moon body */}
        <circle cx="370" cy="32" r="16" fill="#f4edcc" opacity="0.92" />
        {/* Moon crescent shadow */}
        <circle cx="375" cy="30" r="13" fill="#1a1640" opacity="0.55" />

        {/* Horizon glow */}
        <ellipse cx="215" cy="120" rx="180" ry="18" fill="#5a3010" opacity="0.18" />

        {/* Ground */}
        <rect y="120" width="430" height="50" fill="url(#groundGrad)" />

        {/* Ground horizon line */}
        <line x1="0" y1="120" x2="430" y2="120" stroke="#8a5820" strokeWidth="1" opacity="0.5" />

        {/* Soil patches (plot shadows) */}
        {[60, 195, 60, 195].map((x, i) => (
          <ellipse key={i} cx={x + (i >= 2 ? 0 : 0)} cy={125 + (i >= 2 ? 5 : 0)} rx="48" ry="5"
            fill="#3a2210" opacity="0.4" />
        ))}

        {/* Stone path */}
        {hasPath && (
          <g>
            <rect x="0" y="118" width="430" height="9" fill="#3a3028" opacity="0.9" rx="1" />
            {[20, 65, 110, 155, 200, 245, 290, 335, 380].map((x, i) => (
              <ellipse key={i} cx={x} cy="122" rx="16" ry="3" fill="#4a4038" opacity="0.6" />
            ))}
          </g>
        )}

        {/* Greenhouse */}
        {hasGreenhouse && (
          <g>
            {/* Frame */}
            <rect x="10" y="45" width="82" height="72" fill="rgba(136,184,216,0.06)"
              stroke="#88b8d8" strokeWidth="1.2" rx="3" />
            {/* Roof peak */}
            <polyline points="10,45 51,22 92,45" fill="none"
              stroke="#88b8d8" strokeWidth="1.2" opacity="0.8" />
            {/* Ridge post */}
            <line x1="51" y1="22" x2="51" y2="45" stroke="#88b8d8" strokeWidth="0.7" opacity="0.5" />
            {/* Glass panes */}
            <line x1="10" y1="72" x2="92" y2="72" stroke="#88b8d8" strokeWidth="0.6" opacity="0.4" />
            <line x1="51" y1="45" x2="51" y2="117" stroke="#88b8d8" strokeWidth="0.6" opacity="0.4" />
            {/* Glass sheen */}
            <rect x="13" y="48" width="15" height="20" fill="#88b8d8" opacity="0.06" rx="1" />
          </g>
        )}

        {/* Herb rack */}
        {hasRack && (
          <g transform="translate(350, 58)">
            {/* Frame */}
            <rect x="0" y="0" width="58" height="52" fill="rgba(138,96,24,0.1)"
              stroke="#8a6018" strokeWidth="1.5" rx="3" />
            <line x1="0" y1="17" x2="58" y2="17" stroke="#8a6018" strokeWidth="1" opacity="0.8" />
            <line x1="0" y1="34" x2="58" y2="34" stroke="#8a6018" strokeWidth="1" opacity="0.8" />
            {/* Hanging herbs */}
            {[9, 22, 35, 48].map(x => (
              <g key={x}>
                <line x1={x} y1="0" x2={x} y2="-11" stroke="#5a9e6f" strokeWidth="1.2" />
                <circle cx={x} cy="-13" r="2.5" fill="#4a8e5f" opacity="0.9" />
              </g>
            ))}
            {/* Second shelf herbs */}
            {[9, 29, 49].map(x => (
              <g key={x}>
                <line x1={x} y1="17" x2={x} y2="9" stroke="#6aae7f" strokeWidth="1" opacity="0.7" />
                <circle cx={x} cy="7" r="2" fill="#5a9e6f" opacity="0.7" />
              </g>
            ))}
          </g>
        )}

        {/* Moon lamp */}
        {hasLamp && (
          <g transform="translate(300, 80)">
            {/* Pole */}
            <line x1="14" y1="0" x2="14" y2="-28" stroke="#7a6050" strokeWidth="2.5" />
            {/* Arm */}
            <line x1="14" y1="-24" x2="22" y2="-30" stroke="#7a6050" strokeWidth="1.5" />
            {/* Glow halo (animated) */}
            <circle cx="22" cy="-32" r="18" fill="url(#lampGlow)" filter="url(#lampBlur)">
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Lamp body */}
            <circle cx="22" cy="-32" r="7" fill="rgba(255,200,80,0.22)" stroke="#c9a227" strokeWidth="1" />
            {/* Lamp center */}
            <circle cx="22" cy="-32" r="3" fill="#ffe080" opacity="0.7">
              <animate attributeName="opacity" values="0.7;1.0;0.7" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Distant fence silhouette */}
        {[0, 55, 110, 165, 220, 275, 330, 385].map((x, i) => (
          <g key={i} transform={`translate(${x},108)`}>
            <rect x="0" y="0" width="3" height="12" fill="#2a1c0c" rx="1" />
            <rect x="18" y="0" width="3" height="12" fill="#2a1c0c" rx="1" />
            <rect x="0" y="3" width="21" height="2.5" fill="#2a1c0c" rx="1" />
            <rect x="0" y="8" width="21" height="2.5" fill="#2a1c0c" rx="1" />
          </g>
        ))}
      </svg>

      {/* Plot grid */}
      <div className={styles.grid}>
        {garden.map(slot => (
          <PlotSlot key={slot.slotId} slot={slot} />
        ))}
      </div>
    </div>
  )
}
