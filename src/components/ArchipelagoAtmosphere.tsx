import React, { useState } from 'react';

interface ArchipelagoAtmosphereProps {
  isDarkMode?: boolean;
}

/**
 * ArchipelagoAtmosphere
 * 
 * Vivid aerial tropical beach and island wallpaper fixed background.
 * Provides distinct atmospheres for Light & Dark mode:
 * 
 * - Dark Mode: Deep moody tropical night with glowing aqua/emerald lagoon accents,
 *   warm golden fireflies, and dark-tinted ocean waters that clearly shine through.
 * - Light Mode: A gorgeous sunny tropical day with bright, crystal-clear turquoise waters,
 *   sun-kissed golden ambient rays, and breezy translucent overlays.
 */
export const ArchipelagoAtmosphere: React.FC<ArchipelagoAtmosphereProps> = ({ isDarkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // High-resolution aerial tropical beach & turquoise ocean waters
  const wallpaperUrl =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. Vivid High-Resolution Tropical Ocean Wallpaper */}
      <img
        src={wallpaperUrl}
        alt="Tropical Archipelago Aerial Waters"
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transform-gpu transition-opacity duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${isDarkMode ? 'brightness-[0.72] contrast-[1.08] saturate-[1.15]' : 'brightness-[1.03] contrast-[1.02] saturate-[1.1]'}`}
      />

      {/* 2. Light & Dark Mode Atmospheric Treatments */}
      {/* Dark Mode: Moody tropical night with glowing aqua/emerald & amber undertones */}
      <div className="hidden dark:block absolute inset-0">
        {/* Subtle dark tint so the ocean remains vividly visible */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />

        {/* Luminous aquatic & emerald lagoon glow */}
        <div className="absolute top-[20%] right-[10%] w-[650px] h-[650px] rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="absolute top-[40%] right-[30%] w-[500px] h-[500px] rounded-full bg-teal-400/12 blur-[130px]" />

        {/* Warm equatorial sunset & amber horizon glow */}
        <div className="absolute -bottom-[10%] left-[25%] w-[700px] h-[500px] rounded-full bg-amber-500/12 blur-[140px]" />

        {/* Deep celestial top aura */}
        <div className="absolute -top-[15%] left-[10%] w-[600px] h-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

        {/* Gentle dark gradient framing to ensure text comfort */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/60" />
      </div>

      {/* Light Mode: Gorgeous sunny tropical day with golden sunlight rays & crystalline turquoise waters */}
      <div className="block dark:hidden absolute inset-0">
        {/* Airy translucent mist keeping the vibrant ocean completely visible */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />

        {/* Warm golden sunlight radiating from the top-right */}
        <div className="absolute -top-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-amber-300/25 blur-[120px]" />

        {/* Sun-dappled tropical emerald reef glow */}
        <div className="absolute top-[35%] right-[25%] w-[550px] h-[550px] rounded-full bg-emerald-300/15 blur-[130px]" />

        {/* Soft sky-tinted ambient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-emerald-50/25" />
      </div>

      {/* 3. Subtle Archipelago Nautical Contours & Tropical Accents */}
      <svg
        className="absolute inset-0 w-full h-full text-slate-800 dark:text-amber-100"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contourStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="volcanoMist" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.06" />
            <stop offset="60%" stopColor="#059669" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Nautical Bathymetric Ocean Contours */}
        <g className="opacity-30 dark:opacity-45">
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
          className="opacity-40 dark:opacity-60"
        />

        {/* Minimalist Tropical Botanical Palm Fronds (Framing bottom corners) */}
        {/* Left Frond */}
        <g className="opacity-[0.05] dark:opacity-[0.08] transition-opacity">
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
        <g className="opacity-[0.05] dark:opacity-[0.08] transition-opacity">
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
        </g>

        {/* Subtle glowing tropical bioluminescence (kunang-kunang) in dark mode */}
        <g className="opacity-0 dark:opacity-75 transition-opacity">
          <circle cx="210" cy="460" r="1.5" fill="#38bdf8" className="animate-pulse" />
          <circle cx="580" cy="510" r="1.5" fill="#34d399" />
          <circle cx="890" cy="430" r="1.5" fill="#2dd4bf" className="animate-pulse" />
          <circle cx="1120" cy="490" r="1.5" fill="#fbbf24" />
          <circle cx="1280" cy="380" r="1.2" fill="#34d399" />
        </g>
      </svg>
    </div>
  );
};
