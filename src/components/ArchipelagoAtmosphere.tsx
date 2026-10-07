import React, { useState } from 'react';

/**
 * ArchipelagoAtmosphere
 * 
 * High-resolution tropical aerial beach & archipelago wallpaper fixed background,
 * layered with rich moody dark overlays, deep aquatic/emerald tints, warm sunset
 * undertones, and delicate nautical contour curves.
 * 
 * Paired with frosted-glass UI containers to create a floating, luxurious,
 * distraction-free workspace with 100% text readability.
 */
export const ArchipelagoAtmosphere: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reliable, high-resolution aerial tropical beach & turquoise waters wallpaper
  const wallpaperUrl =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. High-Resolution Aerial Tropical Beach & Island Wallpaper */}
      <img
        src={wallpaperUrl}
        alt="Tropical Archipelago Coastal Waters"
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transform-gpu transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Deep Moody Dark & Aquatic Gradient Overlays */}
      {/* Primary dark base overlay (Slate-950 blended for moody cinematic atmosphere) */}
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/82 backdrop-blur-[2px] transition-colors" />

      {/* Deep aquatic & emerald lagoon tint (gives the water a rich, luxurious tropical depth) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-emerald-950/35 to-slate-950/90 mix-blend-multiply" />

      {/* Warm equatorial sunset & golden amber undertones from the bottom horizon */}
      <div className="absolute inset-0 bg-radial-[ellipse_100%_60%_at_50%_100%] from-amber-500/[0.12] via-orange-600/[0.04] to-transparent dark:from-amber-500/[0.10] dark:via-orange-700/[0.04] dark:to-transparent" />

      {/* Tropical ocean lagoon aura on the east/right flank */}
      <div className="absolute top-[25%] -right-[10%] w-[650px] h-[650px] rounded-full bg-emerald-500/[0.08] dark:bg-emerald-400/[0.10] blur-[140px]" />

      {/* Ambient warm golden glow on the top flank */}
      <div className="absolute -top-[12%] left-[25%] w-[600px] h-[500px] rounded-full bg-amber-400/[0.06] dark:bg-amber-400/[0.08] blur-[150px]" />

      {/* 3. Subtle Stylized Archipelago Nautical Contours & Silhouettes */}
      <svg
        className="absolute inset-0 w-full h-full text-slate-800 dark:text-amber-100"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contourStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="volcanoMist" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.05" />
            <stop offset="60%" stopColor="#059669" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Nautical Bathymetric Ocean Contours (recalling nautical charts of the Indonesian seas) */}
        <g className="opacity-35 dark:opacity-50">
          <path
            d="M -100,280 C 200,240 450,330 750,290 C 1050,250 1300,320 1550,270"
            stroke="url(#contourStroke)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
          <path
            d="M -50,420 C 250,390 500,470 820,430 C 1120,390 1350,460 1520,420"
            stroke="url(#contourStroke)"
            strokeWidth="1"
          />
          <path
            d="M -80,540 C 220,510 520,580 880,540 C 1180,500 1380,560 1560,530"
            stroke="url(#contourStroke)"
            strokeWidth="0.8"
            strokeDasharray="6 12"
          />
        </g>

        {/* Distant volcanic mountain silhouette along the lower horizon */}
        <path
          d="M 0,710 
             Q 120,705 220,660 
             Q 260,640 295,590 
             Q 310,570 325,590 
             Q 360,640 430,680 
             Q 520,690 610,650 
             Q 660,625 700,580 
             Q 720,555 740,580 
             Q 780,630 860,670 
             Q 960,685 1060,645 
             Q 1110,625 1150,585 
             Q 1170,565 1190,585 
             Q 1240,640 1340,675 
             Q 1400,690 1440,695 
             L 1440,900 L 0,900 Z"
          fill="url(#volcanoMist)"
          className="opacity-50 dark:opacity-60"
        />

        {/* Minimalist Tropical Botanical Palm Fronds (Framing bottom corners) */}
        {/* Left Frond */}
        <g className="opacity-[0.04] dark:opacity-[0.07] transition-opacity">
          <path
            d="M -20,910 Q 40,840 80,760 Q 110,700 130,620"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M 40,840 Q 90,820 130,835" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 55,815 Q 115,790 155,805" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 70,785 Q 135,755 175,770" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 85,750 Q 150,715 185,730" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 100,710 Q 160,670 190,685" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 115,665 Q 165,625 185,635" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Right Frond */}
        <g className="opacity-[0.04] dark:opacity-[0.07] transition-opacity">
          <path
            d="M 1460,910 Q 1400,830 1360,750 Q 1330,680 1310,600"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M 1400,830 Q 1350,810 1310,825" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1385,800 Q 1325,775 1285,790" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1370,765 Q 1305,735 1265,750" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1355,730 Q 1290,695 1255,710" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 1338,690 Q 1280,650 1250,665" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Subtle glowing embers (kunang-kunang) */}
        <g className="opacity-40 dark:opacity-70">
          <circle cx="210" cy="460" r="1.5" fill="#f59e0b" className="animate-pulse" />
          <circle cx="580" cy="510" r="1.5" fill="#f59e0b" />
          <circle cx="890" cy="430" r="1.2" fill="#34d399" className="animate-pulse" />
          <circle cx="1120" cy="490" r="1.5" fill="#fbbf24" />
        </g>
      </svg>

      {/* 4. Center Vignette: Keeps center stage clean & ultra-readable */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-transparent to-slate-950/40 dark:to-black/60 pointer-events-none" />
    </div>
  );
};
