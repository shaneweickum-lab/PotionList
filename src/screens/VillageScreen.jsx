import { useState } from 'react'
import ShopTab from '../components/village/ShopTab.jsx'
import MineTab from '../components/village/MineTab.jsx'
import SmithyTab from '../components/village/SmithyTab.jsx'
import CommunityTab from '../components/village/CommunityTab.jsx'
import DailyOrders from '../components/profile/DailyOrders.jsx'
import ExchangeTab from '../components/village/ExchangeTab.jsx'
import styles from './VillageScreen.module.css'

function VillageMap({ onEnter }) {
  return (
    <div className={styles.mapWrap}>
      <svg viewBox="0 0 480 272" width="100%" xmlns="http://www.w3.org/2000/svg">
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
        <rect width="480" height="148" fill="url(#vSky)" />

        {/* Stars */}
        {[
          [18,12],[45,8],[72,20],[100,5],[128,16],[155,9],[183,22],[210,6],
          [238,18],[265,11],[293,19],[318,7],[345,14],[28,35],[68,30],
          [115,38],[160,28],[205,34],[250,29],[295,36],[340,32],[12,50],
          [90,44],[185,48],[280,42],[350,46],[55,58],[145,52],[235,55],[325,50],
          [370,10],[392,24],[415,8],[438,18],[460,12],[475,28],
          [365,38],[388,44],[412,32],[435,48],[458,36],[472,52],
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
        <path d="M0,148 Q30,118 62,128 Q92,112 118,122 Q142,107 168,120 Q188,104 212,116 Q236,102 260,114 Q282,104 303,116 Q323,107 344,118 Q352,111 370,116 Q392,108 415,114 Q438,104 460,112 Q470,108 480,112 L480,148 Z"
          fill="#0d1a0e" />

        {/* Ground */}
        <rect x="0" y="148" width="480" height="124" fill="#181f12" />
        {[156, 165, 176, 188].map(y => (
          <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#101508" strokeWidth={y > 172 ? 1.5 : 0.8} opacity="0.55" />
        ))}

        {/* Dirt path */}
        <path d="M0,230 C60,222 120,218 180,222 C240,226 300,220 360,215 C400,211 440,208 480,206"
          fill="none" stroke="#3a2c16" strokeWidth="22" strokeLinecap="round" />
        <path d="M0,230 C60,222 120,218 180,222 C240,226 300,220 360,215 C400,211 440,208 480,206"
          fill="none" stroke="#473620" strokeWidth="14" strokeLinecap="round" />
        <path d="M0,228 C60,220 120,216 180,220 C240,224 300,218 360,213 C400,209 440,206 480,204"
          fill="none" stroke="#2c2010" strokeWidth="1.5" />
        <path d="M0,232 C60,224 120,220 180,224 C240,228 300,222 360,217 C400,213 440,210 480,208"
          fill="none" stroke="#2c2010" strokeWidth="1.5" />

        {/* Grass tufts */}
        {[20, 55, 100, 148, 215, 258, 308, 348, 380, 420, 458].map((x, i) => {
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
        {/* ===================== ORDERS STALL (across the street) ===================== */}
        <g className={styles.building} onClick={() => onEnter('orders')} style={{ cursor: 'pointer' }}>
          {/* Support poles */}
          <rect x="184" y="236" width="5" height="28" rx="1" fill="#5a3c18" />
          <rect x="291" y="236" width="5" height="28" rx="1" fill="#5a3c18" />
          <rect x="237" y="238" width="4" height="26" rx="1" fill="#5a3c18" />
          {/* Canopy stripes (drawn first, clipped by main shape) */}
          {[182, 202, 222, 242, 262, 282].map(x => (
            <rect key={x} x={x} y="228" width="19" height="11" fill="#c89030" opacity="0.7" />
          ))}
          {/* Canopy main shape */}
          <rect x="178" y="228" width="124" height="11" fill="none" stroke="#7a2010" strokeWidth="1" />
          {/* Canopy overlay for the dark stripe effect */}
          {[182, 222, 262].map(x => (
            <rect key={x} x={x} y="228" width="19" height="11" fill="#8a2e18" opacity="0.85" />
          ))}
          {/* Canopy top cap */}
          <rect x="178" y="226" width="124" height="4" rx="1" fill="#6a2010" />
          {/* Scalloped front edge */}
          <path d="M178,239 Q187,235 196,239 Q205,235 214,239 Q223,235 232,239 Q241,235 250,239 Q259,235 268,239 Q277,235 286,239 Q295,235 302,239"
            fill="#8a2e18" stroke="#6a2010" strokeWidth="0.8" />
          {/* Back canvas wall */}
          <rect x="185" y="239" width="110" height="10" fill="#3a2c1c" />
          {/* Counter surface */}
          <rect x="183" y="249" width="114" height="7" rx="1" fill="#8a6030" />
          <rect x="183" y="255" width="114" height="3" rx="1" fill="#6a4820" />
          {/* Counter front face */}
          <rect x="183" y="258" width="114" height="6" rx="1" fill="#5a3a18" />
          {/* Counter legs */}
          <rect x="185" y="261" width="4" height="7" fill="#4a3010" />
          <rect x="291" y="261" width="4" height="7" fill="#4a3010" />
          {/* Items on counter — potion bottles */}
          <ellipse cx="210" cy="249" rx="4" ry="5" fill="#7030a0" opacity="0.85" />
          <rect x="208" y="243" width="4" height="3" rx="1" fill="#9050b0" />
          <ellipse cx="223" cy="250" rx="3" ry="4" fill="#3060b0" opacity="0.85" />
          <rect x="221" y="245" width="3" height="3" rx="1" fill="#5080c0" />
          <ellipse cx="256" cy="249" rx="4" ry="5" fill="#b03030" opacity="0.85" />
          <rect x="254" y="243" width="4" height="3" rx="1" fill="#c04848" />
          <ellipse cx="269" cy="250" rx="3" ry="4" fill="#208040" opacity="0.85" />
          <rect x="267" y="245" width="3" height="3" rx="1" fill="#30a050" />
          {/* Small scroll/parchment in center */}
          <rect x="232" y="244" width="16" height="10" rx="1" fill="#d8c898" />
          <line x1="234" y1="247" x2="246" y2="247" stroke="#9a8860" strokeWidth="0.8" />
          <line x1="234" y1="250" x2="246" y2="250" stroke="#9a8860" strokeWidth="0.8" />
          <line x1="234" y1="253" x2="246" y2="253" stroke="#9a8860" strokeWidth="0.8" />
          {/* Hanging sign from canopy center */}
          <line x1="235" y1="228" x2="233" y2="223" stroke="#6a4828" strokeWidth="1" />
          <line x1="245" y1="228" x2="247" y2="223" stroke="#6a4828" strokeWidth="1" />
          <rect x="224" y="217" width="32" height="12" rx="1" fill="#4a3020" stroke="#7a5030" strokeWidth="0.8" />
          <text x="240" y="226" textAnchor="middle" fill="#c8a060" fontSize="5.5" fontFamily="Georgia, serif">ORDERS</text>
          {/* Lantern on left pole */}
          <line x1="184" y1="242" x2="179" y2="249" stroke="#4a3828" strokeWidth="1" />
          <rect x="174" y="249" width="8" height="10" rx="2" fill="#4a3820" stroke="#6a5030" strokeWidth="0.8" />
          <rect x="175" y="250" width="6" height="8" rx="1" fill="#c87020" opacity="0.65">
            <animate attributeName="opacity" values="0.65;0.9;0.5;0.8;0.65" dur="2.1s" repeatCount="indefinite" />
          </rect>
          {/* Label */}
          <rect x="194" y="266" width="92" height="14" rx="4" fill="#0c1520" opacity="0.88" />
          <text x="240" y="276" textAnchor="middle" fill="#e8d8a0" fontSize="8" fontFamily="Georgia, serif" letterSpacing="1.5">Orders</text>
        </g>

        {/* ===================== EXCHANGE / BOURSE (right of Orders) ===================== */}
        <g className={styles.building} onClick={() => onEnter('exchange')} style={{ cursor: 'pointer' }}>
          {/* Support poles */}
          <rect x="321" y="236" width="5" height="28" rx="1" fill="#2a3010" />
          <rect x="446" y="236" width="5" height="28" rx="1" fill="#2a3010" />
          <rect x="383" y="238" width="4" height="26" rx="1" fill="#2a3010" />
          {/* Canopy — dark green base */}
          {[317, 335, 353, 371, 389, 407, 425, 443].map(x => (
            <rect key={x} x={x} y="228" width="17" height="11" fill="#1a4a18" opacity="0.88" />
          ))}
          {/* Canopy — gold accent stripes */}
          {[326, 344, 362, 380, 398, 416, 434].map(x => (
            <rect key={x} x={x} y="228" width="8" height="11" fill="#b89010" opacity="0.65" />
          ))}
          {/* Canopy border */}
          <rect x="317" y="228" width="134" height="11" fill="none" stroke="#0a2808" strokeWidth="1" />
          {/* Canopy top cap */}
          <rect x="317" y="226" width="134" height="4" rx="1" fill="#0e3010" />
          {/* Scalloped front edge */}
          <path d="M317,239 Q327,235 337,239 Q347,235 357,239 Q367,235 377,239 Q387,235 397,239 Q407,235 417,239 Q427,235 437,239 Q447,235 451,239"
            fill="#1a4a18" stroke="#0a2808" strokeWidth="0.8" />
          {/* Back wall */}
          <rect x="323" y="239" width="126" height="10" fill="#0e1e0e" />
          {/* Chalkboard on back wall */}
          <rect x="336" y="240" width="58" height="8" rx="1" fill="#0a1808" stroke="#2a4018" strokeWidth="0.5" />
          <text x="365" y="246.5" textAnchor="middle" fill="#70b840" fontSize="4" fontFamily="monospace">▲GRN  ▼ORE  ▲EXO</text>
          {/* Counter surface */}
          <rect x="321" y="249" width="130" height="7" rx="1" fill="#2a4818" />
          <rect x="321" y="255" width="130" height="3" rx="1" fill="#1e3810" />
          {/* Counter front face */}
          <rect x="321" y="258" width="130" height="6" rx="1" fill="#182810" />
          {/* Counter legs */}
          <rect x="323" y="261" width="4" height="7" fill="#101e0a" />
          <rect x="443" y="261" width="4" height="7" fill="#101e0a" />
          {/* Coin stacks */}
          <ellipse cx="340" cy="250" rx="6" ry="2" fill="#c8a018" opacity="0.9" />
          <ellipse cx="340" cy="248" rx="6" ry="2" fill="#d4b028" opacity="0.9" />
          <ellipse cx="340" cy="246" rx="6" ry="2" fill="#c8a018" opacity="0.85" />
          <ellipse cx="352" cy="251" rx="4" ry="1.5" fill="#c8a018" opacity="0.8" />
          <ellipse cx="352" cy="249.5" rx="4" ry="1.5" fill="#d4b028" opacity="0.8" />
          {/* Balance scales at center */}
          <line x1="383" y1="243" x2="383" y2="249" stroke="#8a7828" strokeWidth="1" />
          <rect x="376" y="249" width="14" height="2" rx="0.5" fill="#8a7828" />
          <line x1="377" y1="249" x2="373" y2="253" stroke="#8a7828" strokeWidth="0.7" />
          <line x1="389" y1="249" x2="393" y2="253" stroke="#8a7828" strokeWidth="0.7" />
          <ellipse cx="373" cy="253" rx="4" ry="2" fill="#4a4818" opacity="0.8" />
          <ellipse cx="393" cy="253" rx="4" ry="2" fill="#4a4818" opacity="0.8" />
          {/* Ledger book */}
          <rect x="418" y="244" width="18" height="12" rx="1" fill="#3a2810" stroke="#5a4020" strokeWidth="0.5" />
          <line x1="420" y1="247" x2="434" y2="247" stroke="#6a5030" strokeWidth="0.7" />
          <line x1="420" y1="250" x2="434" y2="250" stroke="#6a5030" strokeWidth="0.7" />
          <line x1="420" y1="253" x2="434" y2="253" stroke="#6a5030" strokeWidth="0.7" />
          {/* Hanging sign */}
          <line x1="374" y1="228" x2="372" y2="223" stroke="#2a4018" strokeWidth="1" />
          <line x1="394" y1="228" x2="396" y2="223" stroke="#2a4018" strokeWidth="1" />
          <rect x="358" y="213" width="52" height="12" rx="1" fill="#0e2010" stroke="#365818" strokeWidth="0.8" />
          <text x="384" y="222" textAnchor="middle" fill="#88c048" fontSize="5.5" fontFamily="Georgia, serif">BOURSE</text>
          {/* Lantern on right pole */}
          <line x1="451" y1="242" x2="456" y2="249" stroke="#2a3818" strokeWidth="1" />
          <rect x="453" y="249" width="8" height="10" rx="2" fill="#1e2e18" stroke="#384828" strokeWidth="0.8" />
          <rect x="454" y="250" width="6" height="8" rx="1" fill="#70c030" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.8;0.38;0.68;0.5" dur="2.5s" repeatCount="indefinite" />
          </rect>
          {/* Label */}
          <rect x="326" y="266" width="116" height="14" rx="4" fill="#0c1520" opacity="0.88" />
          <text x="384" y="276" textAnchor="middle" fill="#e8d8a0" fontSize="8" fontFamily="Georgia, serif" letterSpacing="1.5">Exchange</text>
        </g>

        {/* ===================== COMMUNITY HALL (far right) ===================== */}
        <g className={styles.building} onClick={() => onEnter('community')} style={{ cursor: 'pointer' }}>
          {/* Walls */}
          <rect x="362" y="112" width="102" height="66" fill="#504a3c" />
          {/* Stone rows */}
          {[120, 128, 136, 144, 152, 160, 168].map(y => (
            <line key={y} x1="362" y1={y} x2="464" y2={y} stroke="#3a3428" strokeWidth="0.8" opacity="0.5" />
          ))}
          {/* Stone joints even rows */}
          {[120, 136, 152, 168].map(y =>
            [376, 402, 428, 454].map(x => (
              <line key={`${y}${x}`} x1={x} y1={y} x2={x} y2={y + 8} stroke="#3a3428" strokeWidth="0.5" opacity="0.35" />
            ))
          )}
          {/* Stone joints odd rows */}
          {[128, 144, 160].map(y =>
            [369, 395, 421, 447].map(x => (
              <line key={`${y}${x}`} x1={x} y1={y} x2={x} y2={y + 8} stroke="#3a3428" strokeWidth="0.5" opacity="0.35" />
            ))
          )}
          {/* Roof */}
          <polygon points="356,115 413,80 470,115" fill="#3c3028" />
          <polygon points="356,115 413,80 413,115" fill="#322818" />
          {[87, 93, 99, 105].map(y => (
            <line key={y} x1={356 + (y - 80) * 1.0} y1={y} x2={470 - (y - 80) * 1.0} y2={y}
              stroke="#2a2018" strokeWidth="0.8" opacity="0.65" />
          ))}
          <line x1="356" y1="115" x2="470" y2="115" stroke="#201808" strokeWidth="2" />
          {/* Bell tower (centered on roof peak) */}
          <rect x="405" y="62" width="16" height="54" fill="#4e4844" stroke="#3a3430" strokeWidth="0.5" />
          {[70, 78, 86, 94, 102].map(y => (
            <line key={y} x1="405" y1={y} x2="421" y2={y} stroke="#3a3430" strokeWidth="0.5" opacity="0.4" />
          ))}
          <polygon points="401,64 413,48 425,64" fill="#3c3028" />
          <line x1="401" y1="64" x2="425" y2="64" stroke="#201808" strokeWidth="1.5" />
          {/* Bell */}
          <ellipse cx="413" cy="76" rx="5" ry="4" fill="#9a8840" opacity="0.85" />
          <rect x="412" y="72" width="2" height="4" fill="#7a6830" />
          {/* Windows */}
          <rect x="366" y="118" width="24" height="22" rx="1" fill="#1a3050" stroke="#5a4820" strokeWidth="1" />
          <line x1="378" y1="118" x2="378" y2="140" stroke="#2a4060" strokeWidth="0.8" />
          <line x1="366" y1="129" x2="390" y2="129" stroke="#2a4060" strokeWidth="0.8" />
          <rect x="367" y="119" width="22" height="20" rx="1" fill="#d4a820" opacity="0.2">
            <animate attributeName="opacity" values="0.2;0.35;0.15;0.28;0.2" dur="3.2s" repeatCount="indefinite" />
          </rect>
          <rect x="440" y="118" width="24" height="22" rx="1" fill="#1a3050" stroke="#5a4820" strokeWidth="1" />
          <line x1="452" y1="118" x2="452" y2="140" stroke="#2a4060" strokeWidth="0.8" />
          <line x1="440" y1="129" x2="464" y2="129" stroke="#2a4060" strokeWidth="0.8" />
          <rect x="441" y="119" width="22" height="20" rx="1" fill="#d4a820" opacity="0.2">
            <animate attributeName="opacity" values="0.2;0.28;0.16;0.32;0.2" dur="2.6s" repeatCount="indefinite" />
          </rect>
          {/* Hanging sign */}
          <line x1="393" y1="112" x2="393" y2="116" stroke="#6a4828" strokeWidth="1" />
          <line x1="433" y1="112" x2="433" y2="116" stroke="#6a4828" strokeWidth="1" />
          <rect x="391" y="116" width="44" height="13" rx="1" fill="#4a3020" stroke="#7a5030" strokeWidth="0.8" />
          <text x="413" y="125.5" textAnchor="middle" fill="#c8a060" fontSize="5" fontFamily="Georgia, serif">HALL</text>
          {/* Grand double doors with arch */}
          <rect x="397" y="148" width="32" height="30" rx="2" fill="#2a1e0e" stroke="#5a3820" strokeWidth="1" />
          <rect x="398" y="149" width="14" height="20" rx="6" fill="#3a2a14" />
          <rect x="414" y="149" width="14" height="20" rx="6" fill="#3a2a14" />
          <circle cx="411" cy="166" r="2" fill="#8a6030" />
          <circle cx="418" cy="166" r="2" fill="#8a6030" />
          {/* Steps */}
          <rect x="393" y="175" width="40" height="4" rx="1" fill="#3a3028" />
          <rect x="396" y="172" width="34" height="4" rx="1" fill="#433828" />
          {/* Wall torch left */}
          <rect x="360" y="130" width="3" height="14" rx="1" fill="#5a3a18" />
          <ellipse cx="361.5" cy="126" rx="3.5" ry="6" fill="#e07020">
            <animate attributeName="ry" values="6;8;4.5;7;6" dur="0.72s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.85;1;0.9;1" dur="0.72s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="361.5" cy="123" rx="2" ry="4" fill="#ffb040">
            <animate attributeName="ry" values="4;5.5;3;5;4" dur="0.57s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="361" cy="130" rx="14" ry="10" fill="#cc6010" opacity="0.09">
            <animate attributeName="opacity" values="0.09;0.17;0.06;0.13;0.09" dur="0.72s" repeatCount="indefinite" />
          </ellipse>
          {/* Wall torch right */}
          <rect x="466" y="130" width="3" height="14" rx="1" fill="#5a3a18" />
          <ellipse cx="467.5" cy="126" rx="3.5" ry="6" fill="#e07020">
            <animate attributeName="ry" values="6;8;4.5;7;6" dur="0.68s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.85;1;0.9;1" dur="0.68s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="467.5" cy="123" rx="2" ry="4" fill="#ffb040">
            <animate attributeName="ry" values="4;5.5;3;5;4" dur="0.53s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="467" cy="130" rx="14" ry="10" fill="#cc6010" opacity="0.09">
            <animate attributeName="opacity" values="0.09;0.17;0.06;0.13;0.09" dur="0.68s" repeatCount="indefinite" />
          </ellipse>
          {/* Label */}
          <rect x="362" y="185" width="102" height="18" rx="4" fill="#0c1520" opacity="0.88" />
          <text x="413" y="197" textAnchor="middle" fill="#e8d8a0" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1.5">Community</text>
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
        {tab === 'shop'      && <ShopTab />}
        {tab === 'mine'      && <MineTab />}
        {tab === 'smithy'    && <SmithyTab />}
        {tab === 'community' && <CommunityTab />}
        {tab === 'orders'    && <DailyOrders />}
        {tab === 'exchange'  && <ExchangeTab />}
      </div>
    )
  }

  return <VillageMap onEnter={setTab} />
}
