import { useState } from 'react'
import ShopTab from '../components/village/ShopTab.jsx'
import MineTab from '../components/village/MineTab.jsx'
import SmithyTab from '../components/village/SmithyTab.jsx'
import styles from './VillageScreen.module.css'

function VillageMap({ onEnter }) {
  return (
    <div className={styles.mapWrap}>
      <svg viewBox="0 0 360 245" width="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08101e" />
            <stop offset="100%" stopColor="#162340" />
          </linearGradient>
          <radialGradient id="vMoonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ece4c0" />
            <stop offset="60%" stopColor="#d4c898" />
            <stop offset="100%" stopColor="#b8a870" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="360" height="148" fill="url(#vSky)" />

        {/* Stars */}
        {[
          [18,12],[45,8],[72,20],[100,5],[128,16],[155,9],[183,22],[210,6],
          [238,18],[265,11],[293,19],[318,7],[345,14],[28,35],[68,30],
          [115,38],[160,28],[205,34],[250,29],[295,36],[340,32],[12,50],
          [90,44],[185,48],[280,42],[350,46],[55,58],[145,52],[235,55],[325,50],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y}
            r={i % 4 === 0 ? 1.2 : i % 3 === 0 ? 0.9 : 0.6}
            fill="white"
            opacity={0.4 + (i % 4) * 0.15}>
            {i % 6 === 0 && (
              <animate attributeName="opacity"
                values={`${0.4 + (i % 4) * 0.15};0.95;${0.4 + (i % 4) * 0.15}`}
                dur={`${2 + (i % 5) * 0.8}s`} repeatCount="indefinite" />
            )}
          </circle>
        ))}

        {/* Moon */}
        <circle cx="320" cy="30" r="22" fill="url(#vMoonGrad)" opacity="0.95" />
        <circle cx="316" cy="26" r="4" fill="#c8ba80" opacity="0.25" />
        <circle cx="326" cy="35" r="2.5" fill="#c8ba80" opacity="0.2" />
        <circle cx="313" cy="37" r="2" fill="#c8ba80" opacity="0.18" />
        {/* Crescent shadow */}
        <circle cx="327" cy="26" r="18" fill="#162340" opacity="0.5" />

        {/* Distant tree/hill silhouette */}
        <path d="M0,148 Q30,118 62,128 Q92,112 118,122 Q142,107 168,120 Q188,104 212,116 Q236,102 260,114 Q282,104 303,116 Q323,107 344,118 Q352,111 360,120 L360,148 Z"
          fill="#0d1a0e" />

        {/* Ground */}
        <rect x="0" y="148" width="360" height="97" fill="#181f12" />
        {[156, 165, 176, 188].map(y => (
          <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#101508" strokeWidth={y > 172 ? 1.5 : 0.8} opacity="0.55" />
        ))}

        {/* Dirt path */}
        <path d="M0,230 C60,222 120,218 180,222 C240,226 300,220 360,215"
          fill="none" stroke="#3a2c16" strokeWidth="22" strokeLinecap="round" />
        <path d="M0,230 C60,222 120,218 180,222 C240,226 300,220 360,215"
          fill="none" stroke="#473620" strokeWidth="14" strokeLinecap="round" />
        <path d="M0,228 C60,220 120,216 180,220 C240,224 300,218 360,213"
          fill="none" stroke="#2c2010" strokeWidth="1.5" />
        <path d="M0,232 C60,224 120,220 180,224 C240,228 300,222 360,217"
          fill="none" stroke="#2c2010" strokeWidth="1.5" />

        {/* Grass tufts */}
        {[20, 55, 100, 148, 215, 258, 308, 348].map((x, i) => {
          const y = 205 + (i % 3) * 6
          return (
            <g key={x}>
              <line x1={x} y1={y} x2={x - 3} y2={y - 8} stroke="#2a4018" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={x} y1={y} x2={x + 3} y2={y - 9} stroke="#223614" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={x} y1={y} x2={x} y2={y - 10} stroke="#304a1e" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )
        })}

        {/* ===================== SHOP (left) ===================== */}
        <g className={styles.building} onClick={() => onEnter('shop')} style={{ cursor: 'pointer' }}>
          {/* Walls */}
          <rect x="12" y="112" width="90" height="66" fill="#b08860" />
          {/* Timber frame */}
          <line x1="12" y1="148" x2="102" y2="148" stroke="#5a3818" strokeWidth="2" />
          <line x1="57" y1="112" x2="57" y2="178" stroke="#5a3818" strokeWidth="1.5" />
          <line x1="12" y1="128" x2="57" y2="128" stroke="#5a3818" strokeWidth="1" />
          <line x1="57" y1="124" x2="102" y2="124" stroke="#5a3818" strokeWidth="1" />
          <line x1="12" y1="162" x2="57" y2="162" stroke="#5a3818" strokeWidth="1" />
          {/* Cross braces lower-left panel */}
          <line x1="12" y1="148" x2="57" y2="178" stroke="#5a3818" strokeWidth="0.9" opacity="0.5" />
          <line x1="12" y1="178" x2="57" y2="148" stroke="#5a3818" strokeWidth="0.9" opacity="0.5" />
          {/* Roof */}
          <polygon points="6,115 57,82 108,115" fill="#4a2e14" />
          <polygon points="6,115 57,82 57,115" fill="#3e2610" />
          {[90, 96, 102, 108].map(y => (
            <line key={y} x1={6 + (y - 82) * 0.91} y1={y} x2={108 - (y - 82) * 0.91} y2={y}
              stroke="#3a2010" strokeWidth="0.8" opacity="0.6" />
          ))}
          <line x1="6" y1="115" x2="108" y2="115" stroke="#28180a" strokeWidth="2" />
          {/* Window */}
          <rect x="16" y="116" width="22" height="20" rx="1" fill="#1a3050" stroke="#5a3818" strokeWidth="1" />
          <line x1="27" y1="116" x2="27" y2="136" stroke="#2a4060" strokeWidth="0.8" />
          <line x1="16" y1="126" x2="38" y2="126" stroke="#2a4060" strokeWidth="0.8" />
          <rect x="17" y="117" width="20" height="18" rx="1" fill="#d4a820" opacity="0.18">
            <animate attributeName="opacity" values="0.18;0.32;0.14;0.26;0.18" dur="2.8s" repeatCount="indefinite" />
          </rect>
          {/* Hanging sign */}
          <line x1="64" y1="112" x2="64" y2="116" stroke="#6a4828" strokeWidth="1" />
          <line x1="94" y1="112" x2="94" y2="116" stroke="#6a4828" strokeWidth="1" />
          <rect x="62" y="116" width="34" height="13" rx="1" fill="#4a3020" stroke="#7a5030" strokeWidth="0.8" />
          <text x="79" y="125.5" textAnchor="middle" fill="#c8a060" fontSize="5.5" fontFamily="Georgia, serif">SHOP</text>
          {/* Awning */}
          <path d="M12,148 L102,148 L98,158 L16,158 Z" fill="#8a2e18" />
          {[28, 47, 66, 85].map(x => (
            <line key={x} x1={x} y1="148" x2={x - 1} y2="158" stroke="#6a2010" strokeWidth="0.7" opacity="0.6" />
          ))}
          <line x1="12" y1="158" x2="102" y2="158" stroke="#28120a" strokeWidth="1" />
          {/* Door */}
          <rect x="62" y="152" width="26" height="26" rx="2" fill="#3a2010" stroke="#5a3818" strokeWidth="1" />
          <rect x="63" y="153" width="11" height="15" rx="1" fill="#4e3018" />
          <rect x="76" y="153" width="11" height="15" rx="1" fill="#4e3018" />
          <circle cx="74" cy="167" r="2" fill="#8a6030" />
          {/* Wall torch */}
          <rect x="104" y="130" width="3" height="14" rx="1" fill="#5a3a18" />
          <ellipse cx="105.5" cy="126" rx="3.5" ry="6" fill="#e07020">
            <animate attributeName="ry" values="6;8;4.5;7;6" dur="0.65s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.85;1;0.9;1" dur="0.65s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="105.5" cy="123" rx="2" ry="4" fill="#ffb040">
            <animate attributeName="ry" values="4;6;3;5;4" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="105" cy="130" rx="14" ry="10" fill="#cc6010" opacity="0.09">
            <animate attributeName="opacity" values="0.09;0.17;0.06;0.13;0.09" dur="0.65s" repeatCount="indefinite" />
          </ellipse>
          {/* Label */}
          <rect x="14" y="185" width="84" height="18" rx="4" fill="#0c1520" opacity="0.88" />
          <text x="56" y="197" textAnchor="middle" fill="#e8d8a0" fontSize="10" fontFamily="Georgia, serif" letterSpacing="1.5">Shop</text>
        </g>

        {/* ===================== MINE (center) ===================== */}
        <g className={styles.building} onClick={() => onEnter('mine')} style={{ cursor: 'pointer' }}>
          {/* Hill mound */}
          <path d="M116,180 Q132,124 160,107 Q184,94 212,110 Q230,120 246,150 L246,180 Z"
            fill="#263520" />
          {/* Hill texture contours */}
          <path d="M122,170 Q138,134 158,116" fill="none" stroke="#1c2a16" strokeWidth="2" opacity="0.4" />
          <path d="M140,176 Q156,144 174,124" fill="none" stroke="#1c2a16" strokeWidth="1.5" opacity="0.3" />
          <path d="M207,112 Q222,120 236,140" fill="none" stroke="#1c2a16" strokeWidth="1.5" opacity="0.3" />
          {/* Rocky outcrops */}
          <path d="M208,110 Q219,107 230,118 L221,114 Q213,105 210,108 Z" fill="#3c3a28" />
          <path d="M228,130 L237,120 Q237,133 230,140 Z" fill="#343028" />
          <path d="M130,160 Q122,153 120,164 L124,157 Q126,151 133,158 Z" fill="#303528" />
          {/* Mine entrance */}
          <path d="M152,180 L152,150 Q180,124 208,150 L208,180 Z" fill="#080808" />
          {/* Wooden frame */}
          <rect x="147" y="147" width="10" height="34" rx="1" fill="#5a3c18" />
          <rect x="203" y="147" width="10" height="34" rx="1" fill="#5a3c18" />
          <rect x="147" y="143" width="66" height="9" rx="1" fill="#5a3c18" />
          {/* Beam grain */}
          {[147, 152, 157, 162, 167, 172].map(y => (
            <line key={y} x1="147" y1={y} x2="157" y2={y} stroke="#3a2810" strokeWidth="0.5" opacity="0.4" />
          ))}
          {/* Diagonal braces */}
          <line x1="157" y1="143" x2="147" y2="158" stroke="#4a3010" strokeWidth="2" strokeLinecap="round" />
          <line x1="203" y1="143" x2="213" y2="158" stroke="#4a3010" strokeWidth="2" strokeLinecap="round" />
          {/* Rail tracks */}
          <line x1="168" y1="180" x2="168" y2="154" stroke="#606060" strokeWidth="2" />
          <line x1="192" y1="180" x2="192" y2="154" stroke="#606060" strokeWidth="2" />
          {[157, 163, 169, 175].map(y => (
            <line key={y} x1="163" y1={y} x2="197" y2={y} stroke="#505050" strokeWidth="1.5" />
          ))}
          {/* Interior glow */}
          <ellipse cx="180" cy="168" rx="18" ry="10" fill="#c87020" opacity="0.1" />
          {/* Sign */}
          <line x1="163" y1="143" x2="163" y2="130" stroke="#6a4020" strokeWidth="1" />
          <line x1="197" y1="143" x2="197" y2="130" stroke="#6a4020" strokeWidth="1" />
          <rect x="157" y="128" width="46" height="13" rx="2" fill="#4a2e10" stroke="#7a5028" strokeWidth="0.8" />
          <text x="180" y="137.5" textAnchor="middle" fill="#c89848" fontSize="5.5" fontFamily="Georgia, serif">MINE</text>
          {/* Hanging lantern */}
          <line x1="215" y1="143" x2="219" y2="154" stroke="#4a3828" strokeWidth="1.5" />
          <rect x="214" y="154" width="10" height="13" rx="2" fill="#4a3820" stroke="#6a5030" strokeWidth="0.8" />
          <rect x="215" y="155" width="8" height="11" rx="1" fill="#c87020" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.5;0.82;0.6" dur="1.9s" repeatCount="indefinite" />
          </rect>
          {/* Label */}
          <rect x="137" y="185" width="86" height="18" rx="4" fill="#0c1520" opacity="0.88" />
          <text x="180" y="197" textAnchor="middle" fill="#e8d8a0" fontSize="10" fontFamily="Georgia, serif" letterSpacing="1.5">Mine</text>
        </g>

        {/* ===================== SMITHY (right) ===================== */}
        <g className={styles.building} onClick={() => onEnter('smithy')} style={{ cursor: 'pointer' }}>
          {/* Chimney (drawn behind roof) */}
          <rect x="287" y="62" width="22" height="56" fill="#3a3028" stroke="#2a2018" strokeWidth="0.8" />
          <rect x="284" y="59" width="28" height="7" rx="1" fill="#2a2018" />
          {/* Chimney smoke */}
          {[
            { x: 293, d: '0s',    dur: '2.0s' },
            { x: 300, d: '0.65s', dur: '2.4s' },
            { x: 296, d: '1.3s',  dur: '1.9s' },
          ].map((sm, i) => (
            <ellipse key={i} cx={sm.x} cy="57" rx="4" ry="5" fill="#2e2820">
              <animate attributeName="cy" values="57;44;32" dur={sm.dur} begin={sm.d} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" dur={sm.dur} begin={sm.d} repeatCount="indefinite" />
              <animate attributeName="rx" values="4;7;11" dur={sm.dur} begin={sm.d} repeatCount="indefinite" />
            </ellipse>
          ))}
          {/* Walls */}
          <rect x="254" y="112" width="92" height="66" fill="#4e4844" />
          {/* Stone rows */}
          {[120, 128, 136, 144, 152, 160, 168].map(y => (
            <line key={y} x1="254" y1={y} x2="346" y2={y} stroke="#3a3430" strokeWidth="0.8" opacity="0.5" />
          ))}
          {/* Stone joints even rows */}
          {[120, 136, 152, 168].map(y =>
            [268, 294, 320].map(x => (
              <line key={`${y}${x}`} x1={x} y1={y} x2={x} y2={y + 8} stroke="#3a3430" strokeWidth="0.5" opacity="0.35" />
            ))
          )}
          {/* Stone joints odd rows */}
          {[128, 144, 160].map(y =>
            [261, 287, 313, 339].map(x => (
              <line key={`${y}${x}`} x1={x} y1={y} x2={x} y2={y + 8} stroke="#3a3430" strokeWidth="0.5" opacity="0.35" />
            ))
          )}
          {/* Roof */}
          <polygon points="248,115 300,82 352,115" fill="#3c3028" />
          <polygon points="248,115 300,82 300,115" fill="#322818" />
          {[89, 95, 101, 107].map(y => (
            <line key={y} x1={248 + (y - 82) * 0.91} y1={y} x2={352 - (y - 82) * 0.91} y2={y}
              stroke="#2a2018" strokeWidth="0.8" opacity="0.65" />
          ))}
          <line x1="248" y1="115" x2="352" y2="115" stroke="#201808" strokeWidth="2" />
          {/* Forge-glow window */}
          <rect x="316" y="120" width="24" height="22" rx="1" fill="#100804" stroke="#4a3828" strokeWidth="1" />
          <rect x="317" y="121" width="22" height="20" rx="1" fill="#d04000" opacity="0.55">
            <animate attributeName="opacity" values="0.55;0.88;0.42;0.72;0.55" dur="1.05s" repeatCount="indefinite" />
          </rect>
          <ellipse cx="318" cy="136" rx="20" ry="14" fill="#ff5500" opacity="0.07">
            <animate attributeName="opacity" values="0.07;0.14;0.05;0.1;0.07" dur="1.05s" repeatCount="indefinite" />
          </ellipse>
          {/* Door */}
          <rect x="258" y="148" width="28" height="30" rx="2" fill="#2a1e0e" stroke="#4a3020" strokeWidth="1" />
          <rect x="259" y="149" width="12" height="17" rx="1" fill="#3a2a14" />
          <rect x="273" y="149" width="12" height="17" rx="1" fill="#3a2a14" />
          <circle cx="271" cy="166" r="2" fill="#6a4820" />
          {/* Wall torch */}
          <rect x="252" y="130" width="3" height="14" rx="1" fill="#5a3a18" />
          <ellipse cx="253.5" cy="126" rx="3.5" ry="6" fill="#e07020">
            <animate attributeName="ry" values="6;8;4.5;7;6" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.85;1;0.9;1" dur="0.7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="253.5" cy="123" rx="2" ry="4" fill="#ffb040">
            <animate attributeName="ry" values="4;5.5;3;5;4" dur="0.55s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="253" cy="130" rx="14" ry="10" fill="#cc6010" opacity="0.09">
            <animate attributeName="opacity" values="0.09;0.17;0.06;0.13;0.09" dur="0.7s" repeatCount="indefinite" />
          </ellipse>
          {/* Label */}
          <rect x="257" y="185" width="90" height="18" rx="4" fill="#0c1520" opacity="0.88" />
          <text x="302" y="197" textAnchor="middle" fill="#e8d8a0" fontSize="10" fontFamily="Georgia, serif" letterSpacing="1.5">Smithy</text>
        </g>
      </svg>
    </div>
  )
}

export default function VillageScreen() {
  const [tab, setTab] = useState(null)

  if (tab) {
    return (
      <div className={styles.subScreen}>
        <button className={styles.backBtn} onClick={() => setTab(null)}>
          &#8592; Back to Village
        </button>
        {tab === 'shop'   && <ShopTab />}
        {tab === 'mine'   && <MineTab />}
        {tab === 'smithy' && <SmithyTab />}
      </div>
    )
  }

  return <VillageMap onEnter={setTab} />
}
