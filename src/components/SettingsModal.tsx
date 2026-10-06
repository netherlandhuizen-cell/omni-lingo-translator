import React, { useState } from 'react';
import { X, Check, Sliders, Database, RefreshCw, ExternalLink } from 'lucide-react';
import type { EngineSettings, ProviderType } from '../types';
import { clearTranslationCache } from '../services/translator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EngineSettings;
  onSaveSettings: (settings: EngineSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [draft, setDraft] = useState<EngineSettings>(settings);
  const [cacheCleared, setCacheCleared] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(settings);
      setCacheCleared(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleProviderSelect = (provider: ProviderType) => {
    setDraft((prev) => ({ ...prev, provider }));
  };

  const handleClearCache = () => {
    clearTranslationCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleSave = () => {
    onSaveSettings(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Settings
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Configure translation providers, API keys, and debounce speed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
              Provider
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* MyMemory */}
              <button
                type="button"
                onClick={() => handleProviderSelect('mymemory')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  draft.provider === 'mymemory'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  MyMemory
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Free public API
                </div>
              </button>

              {/* LibreTranslate */}
              <button
                type="button"
                onClick={() => handleProviderSelect('libretranslate')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  draft.provider === 'libretranslate'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  LibreTranslate
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Open source / self-hosted
                </div>
              </button>

              {/* DeepL */}
              <button
                type="button"
                onClick={() => handleProviderSelect('deepl')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  draft.provider === 'deepl'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  DeepL
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  DeepL API key required
                </div>
              </button>

              {/* Offline */}
              <button
                type="button"
                onClick={() => handleProviderSelect('offline')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  draft.provider === 'offline'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  Offline
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Local dictionary only
                </div>
              </button>
            </div>
          </div>

          {/* Provider Specific Inputs */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-3">
            {draft.provider === 'mymemory' && (
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Registered Email (Optional)
                </label>
                <input
                  type="email"
                  value={draft.myMemoryEmail || ''}
                  onChange={(e) => setDraft({ ...draft, myMemoryEmail: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                  Increases daily quota to 50,000 words. Leave empty for anonymous access.
                </p>
              </div>
            )}

            {draft.provider === 'libretranslate' && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Instance URL
                  </label>
                  <input
                    type="url"
                    value={draft.libreTranslateUrl || ''}
                    onChange={(e) => setDraft({ ...draft, libreTranslateUrl: e.target.value })}
                    placeholder="https://libretranslate.com"
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={draft.libreTranslateKey || ''}
                    onChange={(e) => setDraft({ ...draft, libreTranslateKey: e.target.value })}
                    placeholder="API key"
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                  />
                </div>
              </div>
            )}

            {draft.provider === 'deepl' && (
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  DeepL Authentication Key
                </label>
                <input
                  type="password"
                  value={draft.deepLKey || ''}
                  onChange={(e) => setDraft({ ...draft, deepLKey: e.target.value })}
                  placeholder="e.g. 12345678-abcd-...:fx"
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 font-mono"
                />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                  Supports Free (:fx) and Pro keys from{' '}
                  <a
                    href="https://www.deepl.com/pro-api"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-0.5"
                  >
                    deepl.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
              </div>
            )}

            {draft.provider === 'offline' && (
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                Local offline dictionary mode. All translations are computed client-side with zero network requests.
              </p>
            )}
          </div>

          {/* Debounce Speed Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Debounce Delay
              </label>
              <span className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {draft.debounceMs}ms
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="900"
              step="50"
              value={draft.debounceMs}
              onChange={(e) => setDraft({ ...draft, debounceMs: Number(e.target.value) })}
              className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
              <span>Fast (200ms)</span>
              <span>Default (380ms)</span>
              <span>Relaxed (900ms)</span>
            </div>
          </div>

          {/* Cache Action */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Database className="w-3.5 h-3.5" />
              <span>Memory Cache</span>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                cacheCleared
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {cacheCleared ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Flushed</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Flush</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
