import styles from './SplashScreen.module.css'

function FlaskIllustration() {
  return (
    <svg viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="68%" r="45%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="liquid" cx="50%" cy="75%" r="60%">
          <stop offset="0%" stopColor="#f0c842" stopOpacity="0.95"/>
          <stop offset="45%" stopColor="#c9a227" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#7a5510" stopOpacity="0.4"/>
        </radialGradient>
        <clipPath id="flaskBody">
          <circle cx="140" cy="228" r="76"/>
        </clipPath>
      </defs>

      {/* Background ambient glow */}
      <ellipse cx="140" cy="225" rx="115" ry="95" fill="url(#bgGlow)"/>

      {/* Crescent moon */}
      <circle cx="52" cy="52" r="20" fill="#1a1505"/>
      <circle cx="60" cy="46" r="16" fill="#0f0d0b"/>

      {/* Stars */}
      <circle cx="42"  cy="32"  r="1.5" fill="#f0c842" opacity="0.7"/>
      <circle cx="65"  cy="22"  r="1"   fill="#f0c842" opacity="0.5"/>
      <circle cx="88"  cy="42"  r="1.2" fill="#c9a227" opacity="0.4"/>
      <circle cx="218" cy="38"  r="2"   fill="#f0c842" opacity="0.75"/>
      <circle cx="244" cy="62"  r="1"   fill="#f0c842" opacity="0.5"/>
      <circle cx="232" cy="22"  r="1.5" fill="#c9a227" opacity="0.6"/>
      <circle cx="26"  cy="148" r="1.2" fill="#c9a227" opacity="0.4"/>
      <circle cx="255" cy="145" r="1"   fill="#f0c842" opacity="0.45"/>
      <circle cx="196" cy="78"  r="1"   fill="#c9a227" opacity="0.35"/>
      <circle cx="78"  cy="108" r="1.2" fill="#f0c842" opacity="0.4"/>

      {/* Diamond sparkles */}
      <path d="M54,182 L56,177 L58,182 L56,187Z"  fill="#c9a227" opacity="0.5"/>
      <path d="M222,192 L224,187 L226,192 L224,197Z" fill="#c9a227" opacity="0.4"/>
      <path d="M30,205 L32,201 L34,205 L32,209Z"  fill="#c9a227" opacity="0.3"/>
      <path d="M248,108 L250,104 L252,108 L250,112Z" fill="#c9a227" opacity="0.35"/>

      {/* Flask neck */}
      <rect x="125" y="118" width="30" height="94" rx="5"
            fill="#181410" stroke="#c9a227" strokeWidth="1.5"/>

      {/* Flask round body */}
      <circle cx="140" cy="228" r="76"
              fill="#181410" stroke="#c9a227" strokeWidth="1.5"/>

      {/* Glowing liquid (clipped to flask) */}
      <ellipse cx="140" cy="268" rx="74" ry="54"
               fill="url(#liquid)" clipPath="url(#flaskBody)"/>

      {/* Liquid surface highlight */}
      <ellipse cx="140" cy="195" rx="58" ry="6"
               fill="#f0c842" opacity="0.08" clipPath="url(#flaskBody)"/>

      {/* Measurement lines */}
      <line x1="82" y1="216" x2="96" y2="216" stroke="#c9a227" strokeWidth="0.8" opacity="0.45"/>
      <line x1="78" y1="234" x2="96" y2="234" stroke="#c9a227" strokeWidth="0.8" opacity="0.45"/>
      <line x1="80" y1="252" x2="96" y2="252" stroke="#c9a227" strokeWidth="0.8" opacity="0.45"/>

      {/* Bubbles */}
      <circle cx="122" cy="250" r="4.5" fill="none" stroke="#f0c842" strokeWidth="0.9" opacity="0.55"/>
      <circle cx="152" cy="258" r="3"   fill="none" stroke="#f0c842" strokeWidth="0.9" opacity="0.4"/>
      <circle cx="138" cy="240" r="5.5" fill="none" stroke="#f0c842" strokeWidth="0.9" opacity="0.5"/>
      <circle cx="160" cy="242" r="2.5" fill="none" stroke="#f0c842" strokeWidth="0.8" opacity="0.35"/>
      <circle cx="128" cy="232" r="2"   fill="none" stroke="#f0c842" strokeWidth="0.8" opacity="0.3"/>

      {/* Stopper body */}
      <rect x="132" y="106" width="16" height="15" rx="3"
            fill="#3d3328" stroke="#c9a227" strokeWidth="1"/>
      {/* Stopper cap */}
      <ellipse cx="140" cy="106" rx="18" ry="6"
               fill="#4a3e2c" stroke="#c9a227" strokeWidth="1"/>

      {/* Steam wisps */}
      <path d="M131,105 Q124,88 131,73 Q138,58 132,43"
            stroke="#c9a227" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.28"/>
      <path d="M140,104 Q147,85 140,70 Q133,55 140,39"
            stroke="#c9a227" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.22"/>
      <path d="M149,105 Q156,90 149,76 Q142,62 150,47"
            stroke="#c9a227" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.18"/>

      {/* Small herbs/leaves at base */}
      <path d="M70,295 Q80,278 90,285 Q80,290 70,295Z"  fill="#3d6b4c" opacity="0.6"/>
      <path d="M66,292 Q72,272 84,280 Q74,286 66,292Z"  fill="#5a9e6f" opacity="0.5"/>
      <path d="M196,292 Q210,278 216,288 Q206,291 196,292Z" fill="#3d6b4c" opacity="0.6"/>
      <path d="M202,290 Q214,270 222,282 Q212,286 202,290Z" fill="#5a9e6f" opacity="0.5"/>
    </svg>
  )
}

export default function SplashScreen({ onEnter }) {
  return (
    <div className={styles.splash}>
      <div className={styles.illustrationWrap}>
        <FlaskIllustration />
      </div>

      <div className={styles.textBlock}>
        <h1 className={styles.title}>AlchemList</h1>
        <p className={styles.subtitle}>Brew your day. Complete your quests.</p>
      </div>

      <div className={styles.footer}>
        <button className={styles.enterBtn} onClick={onEnter}>
          Enter the Workshop
        </button>
      </div>
    </div>
  )
}
