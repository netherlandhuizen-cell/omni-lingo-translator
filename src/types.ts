export type LanguageCode =
  | 'en'
  | 'de'
  | 'nl'
  | 'id'
  | 'fr'
  | 'es'
  | 'ja'
  | 'it'
  | 'pt'
  | 'zh'
  | 'ko'
  | 'ar'
  | 'ru'
  | 'pl'
  | 'tr'
  | 'vi';

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

export type IndustryCategory = 'auto' | 'construction' | 'manufacturing' | 'laboratory' | 'electrical';

export interface IndustryMeta {
  id: IndustryCategory;
  label: string;
  shortLabel: string;
  icon: string;
  biasTerms: string;
  sampleTerms: string[];
}
