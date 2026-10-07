import React, { useState } from 'react';

interface ArchipelagoAtmosphereProps {
  isDarkMode?: boolean;
}

/**
 * ArchipelagoAtmosphere
 * 
 * Cinematic Indonesian Archipelago Hero Background.
 * 
 * - Dark Mode: Moody, dramatic twilight over Raja Ampat karst peaks with rolling mist,
 *   deep atmospheric clouds, glowing lagoon waters, and subtle firefly embers.
 * - Light Mode: Breathtaking tropical morning sun over the iconic islands of Raja Ampat,
 *   radiant turquoise lagoons, lush emerald jungle ridges, and sun-kissed skies.
 * 
 * Features subtle top & bottom atmospheric vignette gradients to keep the interface
 * deeply dramatic while maintaining pristine text contrast across all glass panels.
 */
export const ArchipelagoAtmosphere: React.FC<ArchipelagoAtmosphereProps> = ({ isDarkMode }) => {
  const [darkImgLoaded, setDarkImgLoaded] = useState(false);
  const [lightImgLoaded, setLightImgLoaded] = useState(false);

  // Iconic Indonesian landscapes (Raja Ampat misty peaks & turquoise archipelago)
  const darkWallpaper =
    'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=2560&q=85';
  const lightWallpaper =
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=2560&q=85';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. Cinematic Wallpapers with Smooth Cross-Fade */}
      {/* Dark Mode Wallpaper (Dramatic misty karst peaks and clouds) */}
      <img
        src={darkWallpaper}
        alt="Cinematic Misty Archipelago Peaks"
        onLoad={() => setDarkImgLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transform-gpu transition-all duration-700 ${
          isDarkMode
            ? darkImgLoaded
              ? 'opacity-100 brightness-[0.7] contrast-[1.12] saturate-[1.2]'
              : 'opacity-0'
            : 'opacity-0'
        }`}
      />

      {/* Light Mode Wallpaper (Radiant tropical morning archipelago) */}
      <img
        src={lightWallpaper}
        alt="Sunlit Tropical Islands and Turquoise Lagoon"
        onLoad={() => setLightImgLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transform-gpu transition-all duration-700 ${
          !isDarkMode
            ? lightImgLoaded
              ? 'opacity-100 brightness-[1.02] contrast-[1.05] saturate-[1.12]'
              : 'opacity-0'
            : 'opacity-0'
        }`}
      />

      {/* 2. Atmospheric Overlays & Vignettes */}
      {/* Dark Mode Atmospheric Treatment */}
      <div className="hidden dark:block absolute inset-0">
        {/* Subtle dark oceanic wash allowing peaks & waters to show through vividly */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px]" />

        {/* Luminous tropical lagoon glow */}
        <div className="absolute top-[25%] right-[10%] w-[650px] h-[650px] rounded-full bg-emerald-400/15 blur-[130px]" />
        <div className="absolute top-[45%] right-[30%] w-[500px] h-[500px] rounded-full bg-teal-400/12 blur-[130px]" />

        {/* Warm equatorial ocean & cyan horizon glow */}
        <div className="absolute -bottom-[10%] left-[20%] w-[700px] h-[500px] rounded-full bg-cyan-500/12 blur-[140px]" />

        {/* Deep celestial top aura */}
        <div className="absolute -top-[15%] left-[10%] w-[600px] h-[450px] rounded-full bg-teal-500/10 blur-[140px]" />

        {/* Cinematic top atmospheric gradient */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-transparent" />

        {/* Cinematic bottom atmospheric gradient */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      {/* Light Mode Atmospheric Treatment */}
      <div className="block dark:hidden absolute inset-0">
        {/* Airy translucent morning mist */}
        <div className="absolute inset-0 bg-white/15 backdrop-blur-[0.5px]" />

        {/* Crisp ocean breeze aqua sunburst from top-right */}
        <div className="absolute -top-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-teal-300/20 blur-[130px]" />

        {/* Turquoise lagoon refraction aura */}
        <div className="absolute top-[35%] right-[20%] w-[550px] h-[550px] rounded-full bg-emerald-300/15 blur-[130px]" />

        {/* Top atmospheric gradient for crisp header contrast */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-900/35 via-slate-900/10 to-transparent" />

        {/* Bottom atmospheric gradient for crisp footer contrast */}
        <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-slate-900/35 via-slate-900/10 to-transparent" />
      </div>

      {/* 3. Subtle Archipelago Nautical Contours */}
      <svg
        className="absolute inset-0 w-full h-full text-slate-800 dark:text-emerald-100 pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contourStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Bathymetric depth curves */}
        <g className="opacity-25 dark:opacity-40">
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

        {/* Subtle glowing tropical bioluminescent fireflies in dark mode */}
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
