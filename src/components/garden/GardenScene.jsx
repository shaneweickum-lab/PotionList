import { useStore } from '../../store/index.js'
import PlotSlot from './PlotSlot.jsx'
import styles from './GardenScene.module.css'

export default function GardenScene() {
  const { garden, owned } = useStore()
  const hasPath = owned?.includes('stone_path')
  const hasLamp = owned?.includes('moonlamp')
  const hasRack = owned?.includes('herb_rack')
  const hasGreenhouse = owned?.includes('greenhouse')

  return (
    <div className={styles.scene}>
      {/* SVG background diorama */}
      <svg className={styles.svgBg} viewBox="0 0 430 180" xmlns="http://www.w3.org/2000/svg">
        {/* Sky/ground */}
        <rect width="430" height="180" fill="#0a0805" />
        <rect y="120" width="430" height="60" fill="#141008" />
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <circle key={i} cx={20 + i * 20} cy={10 + (i % 5) * 15} r={0.8} fill="#c9a227" opacity={0.6} />
        ))}
        {/* Ground path */}
        {hasPath && <rect x="0" y="120" width="430" height="8" fill="#2a2218" rx="0" />}
        {/* Moon */}
        <circle cx="370" cy="30" r="18" fill="#e8e0c0" opacity={0.15} />
        {/* Greenhouse overlay */}
        {hasGreenhouse && (
          <g>
            <rect x="10" y="40" width="80" height="75" fill="none" stroke="#88b8d8" strokeWidth="1" opacity={0.3} rx="4" />
            <line x1="50" y1="40" x2="50" y2="115" stroke="#88b8d8" strokeWidth="0.5" opacity={0.3} />
          </g>
        )}
        {/* Herb rack */}
        {hasRack && (
          <g transform="translate(350, 60)">
            <rect x="0" y="0" width="60" height="50" fill="none" stroke="#8a6d18" strokeWidth="1.5" rx="3" />
            <line x1="0" y1="16" x2="60" y2="16" stroke="#8a6d18" strokeWidth="1" />
            <line x1="0" y1="32" x2="60" y2="32" stroke="#8a6d18" strokeWidth="1" />
            {/* Hanging herbs */}
            {[8, 22, 36, 50].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="-10" stroke="#5a9e6f" strokeWidth="1" />
            ))}
          </g>
        )}
        {/* Moon lamp */}
        {hasLamp && (
          <g transform="translate(300, 95)">
            <line x1="15" y1="0" x2="15" y2="-20" stroke="#8a7060" strokeWidth="2" />
            <circle cx="15" cy="-20" r="8" fill="rgba(224,123,57,0.15)" stroke="#c9a227" strokeWidth="1" />
          </g>
        )}
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
