import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  X,
  Loader2,
  Search,
  Cpu,
} from 'lucide-react';
import type { VisualReferenceResult } from '../services/visualReference';
import type { LanguageCode, TranslationState, IndustryCategory } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { INDUSTRY_CATEGORIES, INDUSTRY_KEYS } from '../constants/industries';

interface VisualReferenceCardProps {
  data: VisualReferenceResult | null;
  isLoading: boolean;
  searchTerm: string;
  category: IndustryCategory;
  onSelectCategory: (cat: IndustryCategory) => void;
  texts: TranslationState;
  onSelectSampleTerm: (term: string) => void;
}

export const VisualReferenceCard: React.FC<VisualReferenceCardProps> = ({
  data,
  isLoading,
  searchTerm,
  category,
  onSelectCategory,
  texts,
  onSelectSampleTerm,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(data?.imageUrl || '');
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [hasImgError, setHasImgError] = useState(false);

  // Sync image source & reset transition states on new data
  useEffect(() => {
    if (data?.imageUrl) {
      setImgSrc(data.imageUrl);
      setIsImgLoaded(false);
      setHasImgError(false);
    }
  }, [data?.imageUrl]);

  const handleImageError = () => {
    if (data?.fallbackUrl && imgSrc !== data.fallbackUrl) {
      setImgSrc(data.fallbackUrl);
    } else {
      setHasImgError(true);
    }
  };

  const handleCopyLink = () => {
    const url = imgSrc || data?.imageUrl;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const activeCategoryMeta = INDUSTRY_CATEGORIES[category] || INDUSTRY_CATEGORIES.auto;
  const currentSampleTerms = activeCategoryMeta.sampleTerms;

  return (
    <div className="relative w-full mt-8 rounded-3xl bg-white/95 dark:bg-[#0c1427]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-cyan-500/25 shadow-2xl shadow-cyan-950/10 dark:shadow-cyan-950/30 overflow-hidden transition-all duration-300">
      {/* Top Ambient Neon Border Glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 dark:via-cyan-400 to-transparent opacity-80" />

      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300/40">
            <Cpu className="w-4 h-4 text-slate-950 font-bold" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Visual Reference & Equipment Inspector
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive technical vision and equipment intelligence
            </p>
          </div>
        </div>

        {/* Right action controls */}
        {data && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopyLink}
              title="Copy image link"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsLightboxOpen(true)}
              title="Expand image in high resolution"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Vibrant Industry Theme Selector Bar */}
      <div className="px-6 py-3 bg-slate-50/80 dark:bg-[#080d1a]/60 border-b border-slate-100 dark:border-cyan-500/10 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 select-none flex-shrink-0 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Industry Theme:
        </span>
        {INDUSTRY_KEYS.map((catKey) => {
          const catMeta = INDUSTRY_CATEGORIES[catKey];
          const isSelected = category === catKey;
          return (
            <button
              key={catKey}
              onClick={() => onSelectCategory(catKey)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25 ring-1 ring-cyan-300/50 scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-400/50'
              }`}
            >
              <span>{catMeta.icon}</span>
              <span>{catMeta.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Card Content Area */}
      <div className="p-6">
        {isLoading ? (
          /* Live Shimmer Loading State */
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-80 h-56 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-cyan-500/20 animate-pulse flex-shrink-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
            <div className="flex-1 w-full space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                  Inspecting {activeCategoryMeta.shortLabel.toLowerCase()} equipment for "{searchTerm}"...
                </span>
              </div>
              <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800/80 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800/80 rounded-md animate-pulse" />
              <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800/80 rounded-md animate-pulse" />
              <div className="h-12 w-full bg-slate-200/60 dark:bg-slate-800/50 rounded-xl mt-4 animate-pulse" />
            </div>
          </div>
        ) : data ? (
          /* Live Detected Visual Reference */
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image Preview Column */}
            <div className="flex flex-col w-full md:w-80 flex-shrink-0">
              <div
                onClick={() => !hasImgError && setIsLightboxOpen(true)}
                className={`group relative w-full h-56 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-xl shadow-cyan-950/30 ${
                  hasImgError ? 'flex items-center justify-center p-4' : 'cursor-zoom-in'
                }`}
              >
                {!hasImgError ? (
                  <>
                    <img
                      src={imgSrc || data.imageUrl}
                      alt={data.title}
                      onLoad={() => setIsImgLoaded(true)}
                      onError={handleImageError}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                        isImgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono font-semibold text-cyan-300 flex items-center gap-1.5 shadow-md">
                      <span>{activeCategoryMeta.icon}</span>
                      <span className="uppercase">{data.category}</span>
                    </div>

                    {/* Enlarge Tooltip */}
                    <div className="absolute inset-0 flex items-end p-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-semibold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        Click to enlarge
                      </span>
                    </div>
                  </>
                ) : (
                  /* Holographic Fallback Card */
                  <div className="flex flex-col items-center justify-center text-center p-5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-2xl mb-2.5 shadow-inner">
                      {activeCategoryMeta.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-100 tracking-tight">
                      {data.title}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono mt-1">
                      {data.categoryLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Caption Beneath Picture */}
              <div className="mt-2.5 px-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="truncate">
                  Searched: <strong className="text-cyan-700 dark:text-cyan-300 font-bold">{data.query}</strong>
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {data.source}
                </span>
              </div>
            </div>

            {/* Technical Inspector Details */}
            <div className="flex-1 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30">
                    DETECTED // {data.query.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                    THEME: {activeCategoryMeta.shortLabel}
                  </span>
                </div>

                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {data.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {data.description}
                </p>
              </div>

              {/* Multilingual Nomenclature Grid */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-cyan-500/15">
                <div className="text-[11px] font-bold text-slate-400 dark:text-cyan-400/80 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Multilingual Equipment Nomenclature
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {(['en', 'de', 'nl', 'id'] as LanguageCode[]).map((code) => {
                    const meta = SUPPORTED_LANGUAGES[code];
                    const val = texts[code]?.trim();
                    return (
                      <div
                        key={code}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070e1c]/80 border border-slate-200/80 dark:border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                          <span className="text-sm">{meta.flag}</span>
                          <span>{meta.name}</span>
                        </div>
                        <div
                          className="font-bold text-slate-900 dark:text-cyan-100 truncate mt-1 text-xs"
                          title={val || '-'}
                        >
                          {val || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="py-10 flex flex-col items-center text-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-teal-500/10 to-emerald-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3.5 shadow-lg shadow-cyan-950/20">
              <Search className="w-6 h-6 animate-pulse" />
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">
              Live Equipment & Visual Inspector
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mb-6 leading-relaxed">
              Type any equipment, machine, or technical term into any translation box above. Choose an Industry Theme to target visual models.
            </p>

            {/* Quick Clickable Sample Terms */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 select-none">
                {activeCategoryMeta.shortLabel} suggestions:
              </span>
              {currentSampleTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => onSelectSampleTerm(term)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900/90 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/60 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && data && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl flex flex-col"
          >
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-2 font-bold">
                <span className="text-cyan-400 font-mono">[HIGH-RES]</span>
                <span>{data.title}</span>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={imgSrc || data.imageUrl}
              alt={data.title}
              onError={handleImageError}
              className="max-h-[75vh] w-auto object-contain"
            />
            <div className="p-3.5 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-400 flex items-center justify-between">
              <span>{data.description}</span>
              <a
                href={imgSrc || data.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="underline inline-flex items-center gap-1 text-cyan-300 font-semibold hover:text-cyan-200"
              >
                Open Full Size <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
