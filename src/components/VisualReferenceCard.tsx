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
  const [hasImgError, setHasImgError] = useState(false);

  // Sync image source and reset error state when data updates
  useEffect(() => {
    if (data?.imageUrl) {
      setImgSrc(data.imageUrl);
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
    <div className="w-full mt-8 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/5 shadow-sm dark:shadow-2xl overflow-hidden transition-all duration-200">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 flex items-center justify-center shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Visual Reference & Equipment Inspector
            </h3>
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
              Live Auto-Detection
            </span>
          </div>
        </div>

        {/* Right action controls */}
        {data && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopyLink}
              title="Copy image link"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsLightboxOpen(true)}
              title="Expand image"
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Industry Category / Theme Selector Bar */}
      <div className="px-6 py-2.5 bg-zinc-50/70 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1 select-none flex-shrink-0">
          Context Theme:
        </span>
        {INDUSTRY_KEYS.map((catKey) => {
          const catMeta = INDUSTRY_CATEGORIES[catKey];
          const isSelected = category === catKey;
          return (
            <button
              key={catKey}
              onClick={() => onSelectCategory(catKey)}
              className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
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
          /* Live Loading State */
          <div className="flex flex-col sm:flex-row gap-6 animate-pulse items-center">
            <div className="w-full sm:w-80 h-52 sm:h-56 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/60 flex-shrink-0" />
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-500 dark:text-zinc-400" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  Targeting {activeCategoryMeta.shortLabel.toLowerCase()} visual reference for "{searchTerm}"...
                </span>
              </div>
              <div className="h-6 w-2/3 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-md" />
              <div className="h-4 w-full bg-zinc-200/70 dark:bg-zinc-800/60 rounded-md" />
              <div className="h-4 w-5/6 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-md" />
              <div className="h-10 w-full bg-zinc-200/50 dark:bg-zinc-800/40 rounded-xl mt-4" />
            </div>
          </div>
        ) : data ? (
          /* Live Detected Visual Reference */
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image Preview Column */}
            <div className="flex flex-col w-full md:w-80 flex-shrink-0">
              <div
                onClick={() => !hasImgError && setIsLightboxOpen(true)}
                className={`group relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs ${
                  hasImgError ? 'flex items-center justify-center p-4' : 'cursor-zoom-in'
                }`}
              >
                {!hasImgError ? (
                  <>
                    <img
                      src={imgSrc || data.imageUrl}
                      alt={data.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[11px] text-white/90 font-medium flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" /> Click to enlarge
                      </span>
                    </div>

                    {/* Source attribution tag */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-zinc-200 font-mono">
                      {data.source}
                    </div>
                  </>
                ) : (
                  /* Clean Fallback Graphic Card */
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/80 dark:bg-zinc-700/60 flex items-center justify-center text-xl mb-2">
                      {activeCategoryMeta.icon}
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {data.title}
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Technical Equipment Reference
                    </span>
                  </div>
                )}
              </div>

              {/* Caption beneath picture */}
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center justify-between px-1">
                <span className="truncate">
                  Searched: <strong className="text-zinc-800 dark:text-zinc-200">{data.query}</strong>
                </span>
                <span className="text-[10px] font-mono text-zinc-400 capitalize">
                  {category !== 'auto' ? category : data.source}
                </span>
              </div>
            </div>

            {/* Technical Inspector Details */}
            <div className="flex-1 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                    Term: {data.query}
                  </span>
                  {category !== 'auto' && (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/60 dark:border-indigo-900/60">
                      Context: {activeCategoryMeta.shortLabel}
                    </span>
                  )}
                  {data.photographer && (
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      Photo by {data.photographer}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                  {data.title}
                </h4>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  {data.description}
                </p>
              </div>

              {/* Multilingual Equipment Terms Grid */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Multilingual Nomenclature
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {(['en', 'de', 'nl', 'id'] as LanguageCode[]).map((code) => {
                    const meta = SUPPORTED_LANGUAGES[code];
                    const val = texts[code]?.trim();
                    return (
                      <div
                        key={code}
                        className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80"
                      >
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                          <span>{meta.flag}</span>
                          <span>{meta.name}</span>
                        </div>
                        <div
                          className="font-medium text-zinc-800 dark:text-zinc-200 truncate mt-0.5 text-xs"
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
          <div className="py-8 flex flex-col items-center text-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3 shadow-2xs">
              <Search className="w-5 h-5" />
            </div>

            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Live Equipment & Visual Inspector
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mb-5 leading-relaxed">
              Type any equipment or technical term into any translation box above. Filter by theme to bias context towards your specific industry.
            </p>

            {/* Quick Clickable Sample Terms tailored to active theme */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl">
              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mr-1 select-none">
                {activeCategoryMeta.shortLabel} examples:
              </span>
              {currentSampleTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => onSelectSampleTerm(term)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer active:scale-98"
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-semibold">{data.title}</span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 flex items-center justify-between">
              <span>{data.description}</span>
              <a
                href={imgSrc || data.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="underline inline-flex items-center gap-1 text-zinc-200"
              >
                Full Resolution <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
