import React from 'react';

/**
 * ArchipelagoAtmosphere
 * 
 * Elegant, low-opacity fixed background layer providing an authentic Nusantara
 * atmosphere: distant volcanic island ridges, maritime bathymetric contour curves,
 * subtle tropical palm frond silhouettes, and warm equatorial sunset gradients.
 * 
 * Styled with ultra-subtle opacity to guarantee 100% pristine contrast for all
 * translation textareas and inspector elements.
 */
export const ArchipelagoAtmosphere: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. Deep Atmospheric Gradient Washes */}
      {/* Warm equatorial sunset & terracotta undertone from the horizon */}
      <div className="absolute inset-0 bg-radial-[ellipse_80%_50%_at_50%_100%] from-amber-500/[0.08] via-orange-600/[0.03] to-transparent dark:from-amber-500/[0.07] dark:via-orange-700/[0.035] dark:to-transparent" />
      
      {/* Tropical ocean jade lagoon aura on the east/right flank */}
      <div className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] rounded-full bg-emerald-500/[0.05] dark:bg-emerald-500/[0.07] blur-[140px]" />
      
      {/* Deep celestial midnight aura on the north/top */}
      <div className="absolute -top-[10%] left-[20%] w-[600px] h-[500px] rounded-full bg-amber-400/[0.05] dark:bg-amber-400/[0.06] blur-[150px]" />

      {/* 2. Stylized Archipelago Vector Landscapes & Silhouettes */}
      <svg
        className="absolute inset-0 w-full h-full text-slate-800 dark:text-amber-100"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle sunset horizon gradient */}
          <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
          </linearGradient>

          {/* Distant volcanic mountain silhouette gradient */}
          <linearGradient id="volcanoMist" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.06" />
            <stop offset="60%" stopColor="#059669" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.01" />
          </linearGradient>

          {/* Island coastal shelf gradient */}
          <linearGradient id="islandShelf" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.03" />
            <stop offset="45%" stopColor="#10b981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.03" />
          </linearGradient>

          {/* Bathymetric contour gradient */}
          <linearGradient id="contourStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* --- Maritime Archipelago Bathymetric / Topographic Contours --- */}
        <g className="opacity-40 dark:opacity-60">
          {/* Contour 1: Upper maritime flow */}
          <path
            d="M -100,280 C 200,240 450,330 750,290 C 1050,250 1300,320 1550,270"
            stroke="url(#contourStroke)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
          {/* Contour 2: Mid-island sea corridor */}
          <path
            d="M -50,420 C 250,390 500,470 820,430 C 1120,390 1350,460 1520,420"
            stroke="url(#contourStroke)"
            strokeWidth="1"
          />
          {/* Contour 3: Shelf boundary curve */}
          <path
            d="M -80,540 C 220,510 520,580 880,540 C 1180,500 1380,560 1560,530"
            stroke="url(#contourStroke)"
            strokeWidth="0.8"
            strokeDasharray="6 12"
          />
        </g>

        {/* --- Distant Archipelago Volcanic Ridges (Horizon Silhouette) --- */}
        {/* Layer 1: Receding volcanic mountain peaks (e.g. Bromo / Agung / Rinjani crests) */}
        <path
          d="M 0,690 
             Q 120,685 220,640 
             Q 260,620 295,570 
             Q 310,550 325,570 
             Q 360,620 430,660 
             Q 520,670 610,630 
             Q 660,605 700,560 
             Q 720,535 740,560 
             Q 780,610 860,650 
             Q 960,665 1060,625 
             Q 1110,605 1150,565 
             Q 1170,545 1190,565 
             Q 1240,620 1340,655 
             Q 1400,670 1440,675 
             L 1440,900 L 0,900 Z"
          fill="url(#volcanoMist)"
          className="opacity-70 dark:opacity-80"
        />

        {/* Layer 2: Mid-distance island archipelago chain */}
        <path
          d="M 0,740 
             Q 140,735 260,695 
             Q 340,670 440,690 
             Q 540,710 650,675 
             Q 730,650 820,670 
             Q 930,695 1040,665 
             Q 1140,635 1250,670 
             Q 1360,700 1440,705 
             L 1440,900 L 0,900 Z"
          fill="url(#islandShelf)"
          className="opacity-60 dark:opacity-75"
        />

        {/* Layer 3: Soft coastal shoreline calm waters */}
        <path
          d="M 0,795 
             Q 200,785 400,790 
             Q 600,795 800,785 
             Q 1000,775 1200,790 
             Q 1350,800 1440,795 
             L 1440,900 L 0,900 Z"
          fill="url(#horizonGlow)"
          className="opacity-50 dark:opacity-60"
        />

        {/* Subtle coastal waterline glimmer */}
        <line
          x1="0"
          y1="795"
          x2="1440"
          y2="795"
          stroke="#f59e0b"
          strokeOpacity="0.08"
          strokeWidth="1"
          strokeDasharray="20 40 80 40"
        />

        {/* --- Tropical Botanical Fronds (Artistic Corner Silhouettes) --- */}
        {/* Left Bottom: Graceful arching palm / tropical monstera frond */}
        <g className="opacity-[0.035] dark:opacity-[0.06] transition-opacity">
          {/* Main spine arch */}
          <path
            d="M -20,910 Q 40,840 80,760 Q 110,700 130,620"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Frond leaves branching outward */}
          <path d="M 40,840 Q 90,820 130,835" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 55,815 Q 115,790 155,805" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 70,785 Q 135,755 175,770" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 85,750 Q 150,715 185,730" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 100,710 Q 160,670 190,685" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 115,665 Q 165,625 185,635" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 125,630 Q 160,590 175,600" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Right Bottom: Complementary tropical silhouette framing */}
        <g className="opacity-[0.035] dark:opacity-[0.06] transition-opacity">
          {/* Main spine arch */}
          <path
            d="M 1460,910 Q 1400,830 1360,750 Q 1330,680 1310,600"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Frond leaves branching inward */}
          <path d="M 1400,830 Q 1350,810 1310,825" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1385,800 Q 1325,775 1285,790" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1370,765 Q 1305,735 1265,750" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1355,730 Q 1290,695 1255,710" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1338,690 Q 1280,650 1250,665" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1320,640 Q 1270,605 1250,615" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* --- Subtle Ambient Tropical Embers / Kunang-Kunang (Fireflies) --- */}
        <g className="opacity-40 dark:opacity-70">
          <circle cx="210" cy="460" r="1.5" fill="#f59e0b" className="animate-pulse" />
          <circle cx="340" cy="380" r="1" fill="#10b981" />
          <circle cx="580" cy="510" r="1.5" fill="#f59e0b" />
          <circle cx="890" cy="430" r="1.2" fill="#34d399" className="animate-pulse" />
          <circle cx="1120" cy="490" r="1.5" fill="#fbbf24" />
          <circle cx="1280" cy="390" r="1.2" fill="#10b981" />
          <circle cx="750" cy="320" r="1" fill="#f59e0b" />
          <circle cx="980" cy="280" r="1.5" fill="#34d399" />
        </g>
      </svg>

      {/* 3. Subtle Vignette & Horizon Contrast Preserver */}
      {/* Ensures cards in the center always rest on clean, ultra-legible backdrop */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-transparent to-slate-950/20 dark:to-black/30 pointer-events-none" />
    </div>
  );
};
