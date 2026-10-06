import React, { useState } from 'react';
import { X, Check, Key, Sliders, ShieldCheck, Database, RefreshCw, ExternalLink } from 'lucide-react';
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

  // Sync draft when opened
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
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleSave = () => {
    onSaveSettings(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Translation Engine Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose provider or configure custom API keys for higher volume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Select Translation Provider
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: MyMemory */}
              <button
                type="button"
                onClick={() => handleProviderSelect('mymemory')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  draft.provider === 'mymemory'
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      MyMemory API
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Default Free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    No API key needed. Public community translation engine.
                  </p>
                </div>
              </button>

              {/* Option 2: LibreTranslate */}
              <button
                type="button"
                onClick={() => handleProviderSelect('libretranslate')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  draft.provider === 'libretranslate'
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      LibreTranslate
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      Open Source
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Self-hosted or public LibreTranslate instance.
                  </p>
                </div>
              </button>

              {/* Option 3: DeepL */}
              <button
                type="button"
                onClick={() => handleProviderSelect('deepl')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  draft.provider === 'deepl'
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      DeepL API
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                      High Quality
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Requires DeepL Free or Pro API Key.
                  </p>
                </div>
              </button>

              {/* Option 4: Offline Only */}
              <button
                type="button"
                onClick={() => handleProviderSelect('offline')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  draft.provider === 'offline'
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Offline Mode
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Zero Net
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Fast dictionary matching. 100% offline.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Provider Specific Configuration Fields */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4">
            {draft.provider === 'mymemory' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  MyMemory Registered Email (Optional)
                </label>
                <input
                  type="email"
                  value={draft.myMemoryEmail || ''}
                  onChange={(e) => setDraft({ ...draft, myMemoryEmail: e.target.value })}
                  placeholder="your.email@domain.com"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Adding an email unlocks up to 50,000 chars/day on MyMemory for free. Leave blank for the standard anonymous tier.
                </p>
              </div>
            )}

            {draft.provider === 'libretranslate' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LibreTranslate Instance URL
                  </label>
                  <input
                    type="url"
                    value={draft.libreTranslateUrl || ''}
                    onChange={(e) => setDraft({ ...draft, libreTranslateUrl: e.target.value })}
                    placeholder="https://libretranslate.com"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={draft.libreTranslateKey || ''}
                    onChange={(e) => setDraft({ ...draft, libreTranslateKey: e.target.value })}
                    placeholder="Paste LibreTranslate API key..."
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {draft.provider === 'deepl' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  DeepL Authentication Key
                </label>
                <input
                  type="password"
                  value={draft.deepLKey || ''}
                  onChange={(e) => setDraft({ ...draft, deepLKey: e.target.value })}
                  placeholder="e.g. 12345678-abcd-...:fx"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                  Get your free API key at{' '}
                  <a
                    href="https://www.deepl.com/pro-api"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-0.5"
                  >
                    deepl.com/pro-api <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
              </div>
            )}

            {draft.provider === 'offline' && (
              <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  Using built-in phrase & vocabulary offline engine. Completely private and works with zero internet connection.
                </span>
              </div>
            )}
          </div>

          {/* Real-time Debounce Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Typing Debounce Delay
              </label>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {draft.debounceMs} ms
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="900"
              step="50"
              value={draft.debounceMs}
              onChange={(e) => setDraft({ ...draft, debounceMs: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Faster (200ms)</span>
              <span>Balanced (380ms)</span>
              <span>Cautious (900ms)</span>
            </div>
          </div>

          {/* Translation Cache Control */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Database className="w-4 h-4 text-slate-400" />
              <span>Memory translation cache</span>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                cacheCleared
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cacheCleared ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Cache Cleared</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Flush Cache</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
