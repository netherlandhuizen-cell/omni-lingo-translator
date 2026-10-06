export type LanguageCode = 'en' | 'de' | 'nl' | 'id';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  placeholder: string;
  samplePhrases: string[];
}

export type TranslationState = Record<LanguageCode, string>;

export type LoadingState = Record<LanguageCode, boolean>;

export type ProviderType = 'mymemory' | 'libretranslate' | 'deepl' | 'offline';

export interface EngineSettings {
  provider: ProviderType;
  myMemoryEmail?: string;
  libreTranslateUrl?: string;
  libreTranslateKey?: string;
  deepLKey?: string;
  debounceMs: number;
}
