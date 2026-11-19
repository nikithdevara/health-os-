import React from "react";

/**
 * High-fidelity, clinical-grade procedural Chest Radiograph (PA View).
 * Fully self-contained SVG: zero external network dependencies, infinite resolution.
 * Accurately reflects clinical findings:
 * - Cardiac silhouette within normal limits (Cardiothoracic ratio ~ 0.44)
 * - Clear, sharp costophrenic angles (no focal consolidation or effusion)
 * - Bilateral hilar bronchovascular prominence
 */
export function ChestXRayPA({
  compare = false,
  className = "w-full h-full",
  highlightHilar = false,
}) {
  const studyDate = compare ? "32 DAYS PRIOR" : "CURRENT · PA ERECT";
  const accId = compare ? "CX-4102" : "CX-4417";

  return (
    <svg
      viewBox="0 0 600 700"
      className={className}
      style={{ filter: "contrast(1.12) brightness(0.96)" }}
      aria-label="Chest Radiograph PA View"
    >
      <defs>
        {/* Deep Radiographic Background Gradient */}
        <radialGradient id="lungBgGlow" cx="50%" cy="46%" r="58%">
          <stop offset="0%" stopColor="#080e14" />
          <stop offset="60%" stopColor="#030608" />
          <stop offset="100%" stopColor="#010203" />
        </radialGradient>

        {/* Soft Tissue & Chest Wall Lateral Gradients */}
        <linearGradient id="chestWallLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a2228" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#0a1014" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="chestWallRight" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1a2228" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#0a1014" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>

        {/* Bone Radiopacity Gradient */}
        <linearGradient id="boneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
          <stop offset="50%" stopColor="#dce4ea" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#a0b0ba" stopOpacity="0.45" />
        </linearGradient>

        {/* Rib Subtle Texture */}
        <linearGradient id="ribGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8d6e0" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#eef4f8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#b4c4ce" stopOpacity="0.5" />
        </linearGradient>

        {/* Cardiac Silhouette Gradient */}
        <radialGradient id="cardiacGrad" cx="44%" cy="48%" r="52%">
          <stop offset="0%" stopColor="#dde7ee" stopOpacity="0.86" />
          <stop offset="45%" stopColor="#b2c2cc" stopOpacity="0.78" />
          <stop offset="85%" stopColor="#7c8e99" stopOpacity="0.68" />
          <stop offset="100%" stopColor="#41515c" stopOpacity="0.45" />
        </radialGradient>

        {/* Diaphragm Gradients */}
        <linearGradient id="diaphragmRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e4edf2" stopOpacity="0.88" />
          <stop offset="35%" stopColor="#a8b8c2" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#28343b" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="diaphragmLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d5e0e6" stopOpacity="0.82" />
          <stop offset="35%" stopColor="#98a8b2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#222c33" stopOpacity="0.55" />
        </linearGradient>

        {/* Hilar Vascular Branching Blur Filter */}
        <filter id="vascularBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* 1. Base Dark Field of Radiograph */}
      <rect width="600" height="700" fill="url(#lungBgGlow)" />

      {/* 2. Soft Tissue Anatomy (Neck & Chest Wall Boundaries) */}
      <path
        d="M 220 0 L 220 80 C 205 110, 100 135, 60 180 C 40 210, 36 340, 38 490 C 40 560, 48 640, 60 700 L 540 700 C 552 640, 560 560, 562 490 C 564 340, 560 210, 540 180 C 500 135, 395 110, 380 80 L 380 0 Z"
        fill="#070c10"
        stroke="#1c252d"
        strokeWidth="1.2"
      />

      {/* Chest wall density falloffs */}
      <rect x="0" y="140" width="85" height="560" fill="url(#chestWallLeft)" />
      <rect x="515" y="140" width="85" height="560" fill="url(#chestWallRight)" />

      {/* 3. Vertebral Column / Spine (Midline) */}
      <g stroke="#ffffff" strokeWidth="0.8" opacity="0.45" fill="#c4d2dc">
        {/* Cervical to Mid-Thoracic Vertebrae Bodies */}
        {[60, 95, 130, 168, 206, 246, 286, 328, 370, 414, 458, 504].map((y, idx) => (
          <g key={idx}>
            <rect
              x="284"
              y={y}
              width="32"
              height={idx > 6 ? 26 : 22}
              rx="4"
              fill="#2c3a44"
              stroke="#8ba2b2"
              strokeWidth="1.2"
              opacity={idx > 7 ? 0.35 : 0.65}
            />
            {/* Spinous process shadow */}
            <circle cx="300" cy={y + 12} r="3" fill="#ffffff" opacity="0.3" />
          </g>
        ))}
      </g>

      {/* 4. Trachea & Bronchial Tree Airway Column (Dark radiolucency in midline) */}
      <path
        d="M 293 40 L 293 218 C 293 226, 280 248, 260 268 M 307 40 L 307 218 C 307 226, 320 248, 342 268"
        fill="none"
        stroke="#030608"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Tracheal borders */}
      <path
        d="M 288 40 L 288 220 C 288 230, 274 252, 256 272 M 312 40 L 312 220 C 312 230, 326 252, 346 272"
        fill="none"
        stroke="#6e8696"
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* 5. Clavicles (S-shaped bony radiopaque arches) */}
      <g filter="url(#vascularBlur)">
        {/* Right Clavicle (Patient's right = screen left) */}
        <path
          d="M 284 140 C 255 132, 200 138, 150 148 C 118 155, 96 162, 78 174"
          fill="none"
          stroke="url(#boneGrad)"
          strokeWidth="15"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Left Clavicle (Patient's left = screen right) */}
        <path
          d="M 316 140 C 345 132, 400 138, 450 148 C 482 155, 504 162, 522 174"
          fill="none"
          stroke="url(#boneGrad)"
          strokeWidth="15"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
      {/* Sharp cortical outlines of Clavicles */}
      <path
        d="M 282 136 C 255 128, 200 134, 150 144 C 118 151, 96 158, 78 170"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.75"
      />
      <path
        d="M 318 136 C 345 128, 400 134, 450 144 C 482 151, 504 158, 522 170"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.75"
      />

      {/* 6. Posterior Ribs (Arcs projecting from spine horizontally across lung fields) */}
      <g stroke="url(#ribGrad)" fill="none" opacity="0.6">
        {/* Rib 1 */}
        <path d="M 280 155 C 230 152, 170 170, 150 205" strokeWidth="8" />
        <path d="M 320 155 C 370 152, 430 170, 450 205" strokeWidth="8" />

        {/* Rib 2 */}
        <path d="M 278 185 C 205 180, 130 202, 110 248" strokeWidth="9" />
        <path d="M 322 185 C 395 180, 470 202, 490 248" strokeWidth="9" />

        {/* Rib 3 */}
        <path d="M 276 220 C 185 215, 105 240, 88 295" strokeWidth="10" />
        <path d="M 324 220 C 415 215, 495 240, 512 295" strokeWidth="10" />

        {/* Rib 4 */}
        <path d="M 274 260 C 175 258, 92 288, 76 348" strokeWidth="11" />
        <path d="M 326 260 C 425 258, 508 288, 524 348" strokeWidth="11" />

        {/* Rib 5 */}
        <path d="M 272 300 C 168 300, 82 338, 68 402" strokeWidth="12" />
        <path d="M 328 300 C 432 300, 518 338, 532 402" strokeWidth="12" />

        {/* Rib 6 */}
        <path d="M 270 345 C 165 350, 78 395, 64 460" strokeWidth="13" />
        <path d="M 330 345 C 435 350, 522 395, 536 460" strokeWidth="13" />

        {/* Rib 7 */}
        <path d="M 270 395 C 165 405, 75 455, 62 520" strokeWidth="13" />
        <path d="M 330 395 C 435 405, 525 455, 538 520" strokeWidth="13" />

        {/* Rib 8 */}
        <path d="M 270 445 C 168 460, 78 515, 66 575" strokeWidth="13" />
        <path d="M 330 445 C 432 460, 522 515, 534 575" strokeWidth="13" />

        {/* Rib 9 & 10 lower arches */}
        <path d="M 272 495 C 180 515, 95 568, 80 625" strokeWidth="12" />
        <path d="M 328 495 C 420 515, 505 568, 520 625" strokeWidth="12" />
      </g>

      {/* Anterior Rib Crossings (Faintly visible sloping downwards medially) */}
      <g stroke="#ffffff" strokeWidth="2.5" opacity="0.22" fill="none">
        <path d="M 90 280 C 140 330, 200 370, 240 390" />
        <path d="M 510 280 C 460 330, 400 370, 360 390" />
        <path d="M 80 340 C 135 395, 205 440, 245 460" />
        <path d="M 520 340 C 465 395, 395 440, 355 460" />
        <path d="M 72 410 C 130 470, 205 515, 250 535" />
        <path d="M 528 410 C 470 470, 395 515, 350 535" />
      </g>

      {/* 7. Pulmonary Fields / Lung Parenchyma Dark Zones */}
      {/* Right Lung Field */}
      <path
        d="M 284 165 C 240 160, 150 185, 110 240 C 80 285, 68 375, 70 480 C 72 525, 78 555, 88 568 C 110 562, 170 518, 240 500 C 255 496, 268 495, 280 496 L 280 240 Z"
        fill="#04070a"
        opacity="0.7"
      />
      {/* Left Lung Field */}
      <path
        d="M 316 165 C 360 160, 450 185, 490 240 C 520 285, 532 375, 530 480 C 528 535, 520 565, 510 585 C 485 572, 420 545, 390 535 C 360 480, 340 340, 320 240 Z"
        fill="#04070a"
        opacity="0.7"
      />

      {/* 8. CARDIAC SILHOUETTE & MEDIASTINUM (NORMAL LIMITS: CTR ~ 0.44) */}
      <g>
        {/* Superior Vena Cava & Aortic Knob arch on Left */}
        <path
          d="M 288 170 L 288 230 C 288 270, 276 340, 274 410 C 272 455, 282 505, 290 525 L 310 525 C 324 490, 340 430, 340 350 C 340 270, 328 235, 328 170 Z"
          fill="url(#cardiacGrad)"
        />
        {/* Aortic Arch / Aortic Knob Prominence */}
        <path
          d="M 312 210 C 334 212, 348 225, 346 245 C 344 262, 335 272, 322 280 Z"
          fill="url(#cardiacGrad)"
          stroke="#eef4f8"
          strokeWidth="1.4"
          opacity="0.9"
        />

        {/* Heart Main Silhouette (Left Ventricle + Right Atrium border) */}
        <path
          d="M 274 340 
             C 260 380, 256 440, 275 492
             C 285 518, 305 532, 335 536
             C 375 538, 415 515, 435 480
             C 445 460, 442 430, 430 400
             C 415 365, 385 330, 355 310
             C 340 298, 325 305, 318 315
             Z"
          fill="url(#cardiacGrad)"
          stroke="#d2e0e8"
          strokeWidth="1.8"
          opacity="0.92"
        />

        {/* Cardiac Apex & Left Ventricular Wall highlight */}
        <path
          d="M 385 330 C 418 368, 445 425, 434 478 C 420 512, 380 535, 335 536"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          opacity="0.75"
        />
        {/* Right Heart Border (Right Atrium) */}
        <path
          d="M 276 350 C 262 390, 260 445, 276 492"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          opacity="0.65"
        />
      </g>

      {/* 9. DIAPHRAGM & COSTOPHRENIC ANGLES */}
      {/* Right Hemidiaphragm (Higher dome over liver, sharp costophrenic angle at x=74, y=575) */}
      <path
        d="M 72 575 C 90 540, 150 495, 240 495 C 285 495, 300 520, 305 540 L 305 700 L 72 700 Z"
        fill="url(#diaphragmRight)"
        stroke="#ffffff"
        strokeWidth="2.2"
        opacity="0.9"
      />

      {/* Left Hemidiaphragm (Under heart, sharp costophrenic angle at x=525, y=595) */}
      <path
        d="M 330 535 C 370 518, 440 518, 528 595 L 528 700 L 330 700 Z"
        fill="url(#diaphragmLeft)"
        stroke="#ffffff"
        strokeWidth="2.0"
        opacity="0.88"
      />

      {/* Gastric Air Bubble (Magenblase) under Left Hemidiaphragm */}
      <ellipse cx="400" cy="565" rx="36" ry="18" fill="#04070a" stroke="#485c69" strokeWidth="1.2" opacity="0.85" />
      <path d="M 370 560 Q 400 550 430 560" stroke="#a0b4c0" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Sharp Lateral Costophrenic Sulci Annotations (Normal, No Effusion) */}
      <circle cx="76" cy="572" r="3.5" fill="none" stroke="#68d391" strokeWidth="1.2" opacity="0.8" />
      <circle cx="524" cy="592" r="3.5" fill="none" stroke="#68d391" strokeWidth="1.2" opacity="0.8" />

      {/* 10. BILATERAL HILAR BRONCHOVASCULAR MARKINGS (Matches Finding: Mild bilateral hilar prominence 61%) */}
      <g filter="url(#vascularBlur)" opacity={compare ? "0.6" : "0.85"}>
        {/* Right Hilum & Pulmonary Artery Branches */}
        <path
          d="M 276 280 C 250 282, 215 305, 180 340 M 274 295 C 240 310, 195 350, 165 410 M 275 310 C 235 340, 185 415, 150 480 M 276 270 C 245 260, 200 240, 160 220"
          stroke="#d8e6ef"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Left Hilum & Main Pulmonary Trunk Branches */}
        <path
          d="M 326 265 C 355 268, 395 285, 435 320 M 330 280 C 370 295, 420 340, 455 395 M 334 298 C 385 330, 440 395, 470 460 M 326 250 C 360 240, 405 220, 445 200"
          stroke="#d8e6ef"
          strokeWidth="6.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Fine terminal vascular arborization lines */}
      <g stroke="#ffffff" strokeWidth="1.2" opacity="0.45" fill="none">
        <path d="M 215 305 C 190 320, 160 335, 135 355 M 180 340 C 160 365, 140 380, 120 420" />
        <path d="M 395 285 C 420 300, 450 315, 475 335 M 420 340 C 440 365, 460 380, 480 420" />
      </g>

      {/* AI Finding Highlight Ring if Active */}
      {highlightHilar && (
        <g>
          <ellipse cx="235" cy="310" rx="45" ry="55" fill="none" stroke="#E8F84A" strokeWidth="1.8" strokeDasharray="4 3" />
          <ellipse cx="365" cy="300" rx="45" ry="55" fill="none" stroke="#E8F84A" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="365" y="235" fill="#E8F84A" fontSize="11" fontFamily="monospace" fontWeight="bold">
            HILAR PROMINENCE (61%)
          </text>
        </g>
      )}

      {/* 11. CLINICAL RADIOLOGY ANNOTATIONS & CALIBRATION RETICLE */}
      {/* Patient Right Marker "R" (Screen Left) */}
      <g transform="translate(42, 60)">
        <rect x="0" y="0" width="34" height="42" rx="4" fill="#000000" stroke="#ffffff" strokeWidth="1.4" opacity="0.85" />
        <text x="17" y="30" fill="#ffffff" fontSize="26" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          R
        </text>
      </g>

      {/* Hospital & Technique Stamp */}
      <g transform="translate(42, 640)" fill="#ffffff" opacity="0.75" fontFamily="monospace" fontSize="9.5">
        <text x="0" y="0" fontWeight="bold">ST. CORDELIA HEALTH · PACS-DIAGNOSTIC</text>
        <text x="0" y="14" fill="#a0b4c0">{studyDate} · ACC: {accId}</text>
        <text x="0" y="28" fill="#718096">120 kVp · 3.2 mAs · SID 180cm · EI: 220</text>
      </g>

      {/* Calibration Centimeter Ruler on Right Margin */}
      <g transform="translate(580, 200)" stroke="#ffffff" opacity="0.4" strokeWidth="1">
        <line x1="0" y1="0" x2="0" y2="240" />
        {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((y, idx) => (
          <line key={idx} x1="-8" y1={y} x2="0" y2={y} strokeWidth={idx % 5 === 0 ? 1.8 : 1} />
        ))}
        <text x="-12" y="125" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="end" transform="rotate(-90 -12 125)">
          CALIBRATED 10cm
        </text>
      </g>

      {/* Center crosshair */}
      <g stroke="#ffffff" opacity="0.15" strokeWidth="1">
        <line x1="300" y1="340" x2="300" y2="360" />
        <line x1="290" y1="350" x2="310" y2="350" />
      </g>
    </svg>
  );
}

/**
 * 4-Chamber HLA (Horizontal Long Axis) Cardiac MRI View
 * High-contrast, authentic cine slice:
 * - Bright hyperintense blood pool in LV, RV, LA, RA
 * - Dark muscular myocardium & interventricular septum
 * - True thoracic anatomy (chest wall, spine, lungs)
 */
export function CardiacMriHLA({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 160 110" className={className}>
      <defs>
        <radialGradient id="bloodPoolLV" cx="42%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#dce4e8" />
          <stop offset="100%" stopColor="#788892" />
        </radialGradient>
        <radialGradient id="bloodPoolRV" cx="30%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0f4f8" />
          <stop offset="75%" stopColor="#b4c2ca" />
          <stop offset="100%" stopColor="#5a6870" />
        </radialGradient>
        <radialGradient id="bloodPoolAtria" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e2ecf2" />
          <stop offset="80%" stopColor="#96a8b2" />
          <stop offset="100%" stopColor="#445058" />
        </radialGradient>
      </defs>

      {/* Black Background / Field */}
      <rect width="160" height="110" fill="#030406" />

      {/* Surrounding Thoracic Body Outline */}
      <path
        d="M 25 18 C 50 10, 110 10, 138 20 C 152 40, 150 80, 136 96 C 110 104, 50 104, 24 96 C 10 80, 8 40, 25 18 Z"
        fill="#0b0e12"
        stroke="#1e2630"
        strokeWidth="1.2"
      />

      {/* Dark Lung Cavities */}
      <ellipse cx="38" cy="55" rx="18" ry="24" fill="#010204" />
      <ellipse cx="122" cy="55" rx="18" ry="24" fill="#010204" />

      {/* Thoracic Spine / Vertebra Posteriorly */}
      <rect x="74" y="86" width="16" height="12" rx="3" fill="#323c46" stroke="#4a5866" strokeWidth="0.8" />
      <circle cx="82" cy="92" r="3.5" fill="#141a20" />

      {/* Descending Thoracic Aorta */}
      <circle cx="68" cy="84" r="5" fill="#ffffff" stroke="#2a343e" strokeWidth="1.5" />

      {/* Cardiac Myocardial Mass (Dark gray muscular casing) */}
      <path
        d="M 52 35 C 72 26, 102 32, 108 55 C 110 72, 94 82, 75 80 C 60 78, 45 68, 44 54 C 44 44, 48 38, 52 35 Z"
        fill="#182026"
        stroke="#2c3842"
        strokeWidth="1.2"
      />

      {/* Left Ventricle (LV) - Bright Blood Pool & Thick Myocardium */}
      {/* Muscular Apex & Free Wall */}
      <path
        d="M 58 40 C 66 34, 76 38, 78 52 C 78 65, 72 74, 64 74 C 55 72, 50 62, 52 50 Z"
        fill="url(#bloodPoolLV)"
      />

      {/* Interventricular Septum (Muscular divide between LV and RV) */}
      <path
        d="M 74 38 C 76 48, 76 62, 72 73"
        stroke="#12181e"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right Ventricle (RV) - Crescent Shaped Blood Pool */}
      <path
        d="M 77 40 C 88 42, 94 48, 92 60 C 90 68, 84 72, 76 72 C 78 62, 78 48, 77 40 Z"
        fill="url(#bloodPoolRV)"
      />

      {/* Left Atrium (LA) */}
      <ellipse cx="68" cy="30" rx="9" ry="7" fill="url(#bloodPoolAtria)" />
      {/* Right Atrium (RA) */}
      <ellipse cx="88" cy="32" rx="8" ry="6" fill="url(#bloodPoolAtria)" />

      {/* Valve Planes (Mitral & Tricuspid signal voids) */}
      <line x1="58" y1="38" x2="74" y2="38" stroke="#0e1318" strokeWidth="1.6" />
      <line x1="78" y1="38" x2="94" y2="40" stroke="#0e1318" strokeWidth="1.6" />

      {/* PACS Technical Stamp */}
      <text x="6" y="12" fill="#ffffff" opacity="0.85" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        HLA 4-CH
      </text>
      <text x="6" y="20" fill="#a0aec0" opacity="0.7" fontSize="5" fontFamily="monospace">
        TE:1.3 TR:3.1
      </text>
      <text x="136" y="12" fill="#E8F84A" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        CINE
      </text>
    </svg>
  );
}

/**
 * Short-Axis Mid-Ventricular Cardiac MRI View
 * The classic "doughnut" left ventricle with thick concentric myocardium
 * and crescent-shaped right ventricle wrapped around it.
 */
export function CardiacMriShortAxis({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 160 110" className={className}>
      <defs>
        <radialGradient id="lvBloodPoolSA" cx="48%" cy="48%" r="48%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#e4edf2" />
          <stop offset="90%" stopColor="#8ca0ac" />
          <stop offset="100%" stopColor="#485864" />
        </radialGradient>
        <linearGradient id="rvBloodPoolSA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#b0c0cb" />
          <stop offset="100%" stopColor="#556570" />
        </linearGradient>
      </defs>

      <rect width="160" height="110" fill="#030406" />

      {/* Thorax contour */}
      <ellipse cx="80" cy="55" rx="66" ry="48" fill="#0b0e12" stroke="#1e2630" strokeWidth="1.2" />

      {/* Spine Posteriorly */}
      <rect x="73" y="88" width="16" height="12" rx="3" fill="#2c3640" stroke="#465462" strokeWidth="0.8" />
      <circle cx="81" cy="94" r="3" fill="#0c1014" />
      <circle cx="95" cy="84" r="5" fill="#ffffff" />

      {/* Left Ventricle Thick Myocardial Ring (The Doughnut) */}
      <circle cx="70" cy="50" r="25" fill="#18222a" stroke="#32404c" strokeWidth="1.5" />

      {/* Left Ventricle Circular Blood Pool */}
      <circle cx="70" cy="50" r="15" fill="url(#lvBloodPoolSA)" />

      {/* Papillary Muscles (Anterolateral & Posteromedial) */}
      <circle cx="62" cy="56" r="3.2" fill="#1c2630" stroke="#0e1418" strokeWidth="0.8" />
      <circle cx="78" cy="55" r="3.4" fill="#1c2630" stroke="#0e1418" strokeWidth="0.8" />

      {/* Right Ventricle Crescent Wrapping the Septum */}
      <path
        d="M 55 30 C 44 38, 42 62, 54 70 C 46 62, 46 38, 55 30 Z"
        fill="url(#rvBloodPoolSA)"
        stroke="#1c2630"
        strokeWidth="1.2"
      />

      {/* PACS Technical Stamp */}
      <text x="6" y="12" fill="#ffffff" opacity="0.85" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        SAX MID-LV
      </text>
      <text x="6" y="20" fill="#a0aec0" opacity="0.7" fontSize="5" fontFamily="monospace">
        SL:8mm FA:45°
      </text>
      <text x="134" y="12" fill="#E8F84A" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        EF 58%
      </text>
    </svg>
  );
}

/**
 * 2-Chamber VLA (Vertical Long Axis) Cardiac MRI View
 * Showing Left Atrium, Mitral Valve, Left Ventricle extending down to Apex
 */
export function CardiacMriVLA({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 160 110" className={className}>
      <defs>
        <radialGradient id="vlaBloodPool" cx="48%" cy="52%" r="48%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#dce6ec" />
          <stop offset="100%" stopColor="#60707a" />
        </radialGradient>
      </defs>

      <rect width="160" height="110" fill="#030406" />

      {/* Anatomical Thoracic Shell */}
      <path
        d="M 28 20 C 50 12, 110 12, 134 22 C 148 42, 146 78, 132 94 C 110 102, 50 102, 26 94 C 12 78, 10 42, 28 20 Z"
        fill="#0b0e12"
      />

      {/* Spine & Aorta */}
      <circle cx="115" cy="80" r="5.5" fill="#ffffff" />
      <rect x="94" y="84" width="14" height="10" rx="2" fill="#2c3640" />

      {/* Thick LV Myocardium Envelope */}
      <path
        d="M 64 24 C 84 24, 94 36, 94 58 C 94 80, 80 92, 68 92 C 54 92, 46 76, 48 54 C 50 36, 56 24, 64 24 Z"
        fill="#18222a"
        stroke="#2e3c48"
        strokeWidth="1.2"
      />

      {/* Left Ventricle Chamber Cavity */}
      <path
        d="M 66 38 C 78 38, 86 46, 85 62 C 84 76, 76 84, 68 84 C 60 84, 56 74, 57 60 C 58 46, 62 38, 66 38 Z"
        fill="url(#vlaBloodPool)"
      />

      {/* Left Atrium Upper Cavity */}
      <ellipse cx="67" cy="28" rx="10" ry="7" fill="url(#vlaBloodPool)" />

      {/* Mitral valve plane ring */}
      <line x1="57" y1="36" x2="78" y2="36" stroke="#0c1116" strokeWidth="1.8" />

      {/* PACS Technical Stamp */}
      <text x="6" y="12" fill="#ffffff" opacity="0.85" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        VLA 2-CH
      </text>
      <text x="6" y="20" fill="#a0aec0" opacity="0.7" fontSize="5" fontFamily="monospace">
        FOV:320 R-R
      </text>
      <text x="136" y="12" fill="#E8F84A" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        CINE
      </text>
    </svg>
  );
}

/**
 * Coronal / LV Outflow Tract (LVOT 3-Chamber) Cardiac MRI View
 * Showing Aortic Valve, Ascending Aorta, Left Ventricle & Atrium
 */
export function CardiacMriCoronal({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 160 110" className={className}>
      <defs>
        <radialGradient id="coronalBlood" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#dce5eb" />
          <stop offset="100%" stopColor="#62737e" />
        </radialGradient>
      </defs>

      <rect width="160" height="110" fill="#030406" />

      {/* Thorax */}
      <ellipse cx="80" cy="55" rx="64" ry="46" fill="#0b0e12" stroke="#1e2630" strokeWidth="1" />

      {/* Spine & Ribs */}
      <rect x="74" y="86" width="14" height="11" rx="2" fill="#2a343e" />
      <circle cx="81" cy="91" r="3" fill="#0a0e12" />

      {/* Ascending Aorta Root emerging from LV */}
      <path
        d="M 76 20 C 86 20, 94 30, 92 45 C 90 52, 85 55, 78 52 C 75 42, 70 30, 76 20 Z"
        fill="url(#coronalBlood)"
        stroke="#1a242c"
        strokeWidth="1.2"
      />

      {/* Left Ventricle Body */}
      <path
        d="M 60 48 C 72 45, 84 52, 84 68 C 84 82, 74 90, 64 90 C 52 90, 46 78, 48 64 C 50 54, 54 48, 60 48 Z"
        fill="url(#coronalBlood)"
        stroke="#1a242c"
        strokeWidth="1.2"
      />

      {/* Muscular Wall Boundaries */}
      <path
        d="M 44 64 C 42 84, 52 96, 65 96 C 78 96, 89 86, 90 68"
        fill="none"
        stroke="#1e2a34"
        strokeWidth="4"
      />

      {/* PACS Technical Stamp */}
      <text x="6" y="12" fill="#ffffff" opacity="0.85" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        LVOT 3-CH
      </text>
      <text x="6" y="20" fill="#a0aec0" opacity="0.7" fontSize="5" fontFamily="monospace">
        AORTIC ROOT
      </text>
      <text x="136" y="12" fill="#E8F84A" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        FLOW
      </text>
    </svg>
  );
}

/**
 * 2x2 Photorealistic Cardiac MRI Slices Grid Component
 * Direct replacement for broken images in cards and modals.
 */
export function CardiacMri2x2Grid({ className = "", onSelectSlice }) {
  const slices = [
    { id: "hla", label: "HLA (4-Chamber)", Component: CardiacMriHLA },
    { id: "sax", label: "Short-Axis Basal", Component: CardiacMriShortAxis },
    { id: "vla", label: "VLA (2-Chamber)", Component: CardiacMriVLA },
    { id: "cor", label: "LVOT (3-Chamber)", Component: CardiacMriCoronal },
  ];

  return (
    <div className={`grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg-black p-0.5 border border-zinc-800 ${className}`}>
      {slices.map((slice) => {
        const Comp = slice.Component;
        return (
          <div
            key={slice.id}
            onClick={(e) => {
              if (onSelectSlice) {
                e.stopPropagation();
                onSelectSlice(slice);
              }
            }}
            className="group relative h-14 w-full overflow-hidden bg-[#020406] rounded flex items-center justify-center border border-zinc-900 transition-all hover:border-zinc-600 hover:scale-[1.01]"
          >
            <Comp />
            <span className="absolute bottom-0.5 left-1 text-[5.5px] font-mono text-zinc-300 bg-black/60 px-1 py-0.2 rounded pointer-events-none">
              {slice.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
