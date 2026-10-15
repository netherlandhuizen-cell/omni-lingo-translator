import type { LanguageCode, EngineSettings } from '../types';
import { lookupOfflineDictionary } from './dictionary';

/**
 * In-memory LRU/map cache for instant responses and avoiding repeat API calls
 */
const translationCache = new Map<string, string>();

/**
 * Safely decodes HTML entities returned by some external APIs (e.g. &#39; -> ')
 */
function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') {
    return text
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  const parser = document.createElement('textarea');
  parser.innerHTML = text;
  return parser.value;
}

/**
 * Generates a unique cache key for a given translation request
 */
function getCacheKey(text: string, from: LanguageCode, to: LanguageCode, provider: string): string {
  return `${provider}:${from.toLowerCase()}->${to.toLowerCase()}:${text.trim().toLowerCase()}`;
}

/**
 * Splits text up to 1,000 characters into safe chunks <= 420 characters
 * to comply with external single query limits.
 */
function splitTextIntoSafeChunks(text: string, maxChunkLen: number = 420): string[] {
  if (text.length <= maxChunkLen) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkLen) {
      chunks.push(remaining);
      break;
    }

    let splitIdx = remaining.lastIndexOf('\n', maxChunkLen);
    if (splitIdx === -1 || splitIdx < 80) splitIdx = remaining.lastIndexOf('. ', maxChunkLen);
    if (splitIdx === -1 || splitIdx < 80) splitIdx = remaining.lastIndexOf('! ', maxChunkLen);
    if (splitIdx === -1 || splitIdx < 80) splitIdx = remaining.lastIndexOf('? ', maxChunkLen);
    if (splitIdx === -1 || splitIdx < 80) splitIdx = remaining.lastIndexOf(' ', maxChunkLen);
    if (splitIdx === -1) splitIdx = maxChunkLen;
    else if (remaining[splitIdx] === '.' || remaining[splitIdx] === '!' || remaining[splitIdx] === '?') {
      splitIdx += 1;
    }

    const chunk = remaining.slice(0, splitIdx).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.slice(splitIdx).trim();
  }

  return chunks.length > 0 ? chunks : [text];
}

/**
 * Single chunk MyMemory translation with strict language pair separation
 */
async function translateMyMemoryChunk(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  email?: string,
  signal?: AbortSignal
): Promise<string> {
  const sourceCode = (from || '').trim().toLowerCase();
  const targetCode = (to || '').trim().toLowerCase();

  // Strict validation: never translate identical source/target
  if (!sourceCode || !targetCode || sourceCode === targetCode) {
    return '';
  }

  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceCode}|${targetCode}`,
  });

  if (email && email.trim()) {
    params.append('de', email.trim());
  }

  const url = `https://api.mymemory.translated.net/get?${params.toString()}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`MyMemory API error: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data?.responseStatus === 200 || data?.responseData?.translatedText) {
    let translated = data.responseData?.translatedText;

    // Check if MyMemory returned a rate limit quota warning
    if (
      typeof translated === 'string' &&
      translated.toUpperCase().includes('MYMEMORY WARNING')
    ) {
      throw new Error('MyMemory daily quota exceeded.');
    }

    const cleanInput = text.trim().toLowerCase();

    // If MyMemory echoed the query text, inspect matches array for real non-echo translations
    if (typeof translated === 'string' && translated.trim().toLowerCase() === cleanInput) {
      if (Array.isArray(data.matches) && data.matches.length > 0) {
        const nonEchoMatch = data.matches.find(
          (m: any) =>
            m.translation &&
            typeof m.translation === 'string' &&
            m.translation.trim().toLowerCase() !== cleanInput &&
            !m.translation.startsWith('http') &&
            !m.translation.toUpperCase().includes('MYMEMORY WARNING')
        );
        if (nonEchoMatch?.translation) {
          translated = nonEchoMatch.translation;
        }
      }
    }

    return decodeHtmlEntities(translated);
  }

  throw new Error(data?.responseDetails || 'MyMemory translation failed');
}

/**
 * MyMemory API Translation (supports paragraphs up to 1,000 characters)
 */
async function translateWithMyMemory(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  email?: string,
  signal?: AbortSignal
): Promise<string> {
  if (text.length <= 420) {
    return translateMyMemoryChunk(text, from, to, email, signal);
  }

  const chunks = splitTextIntoSafeChunks(text, 420);
  const translatedChunks = await Promise.all(
    chunks.map((chunk) => translateMyMemoryChunk(chunk, from, to, email, signal))
  );

  return translatedChunks.join(' ');
}

/**
 * LibreTranslate API Translation with strict language pair separation
 */
async function translateWithLibreTranslate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  endpointUrl: string = 'https://libretranslate.com',
  apiKey?: string,
  signal?: AbortSignal
): Promise<string> {
  const sourceCode = (from || '').trim().toLowerCase();
  const targetCode = (to || '').trim().toLowerCase();

  if (!sourceCode || !targetCode || sourceCode === targetCode) {
    return '';
  }

  const url = `${endpointUrl.replace(/\/$/, '')}/translate`;

  const payload: Record<string, string> = {
    q: text,
    source: sourceCode,
    target: targetCode,
    format: 'text',
  };

  if (apiKey && apiKey.trim()) {
    payload.api_key = apiKey.trim();
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate error: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data?.translatedText) {
    return data.translatedText;
  }

  throw new Error('LibreTranslate invalid response');
}

/**
 * DeepL API Translation with strict language pair separation
 */
async function translateWithDeepL(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  apiKey: string,
  signal?: AbortSignal
): Promise<string> {
  if (!apiKey) {
    throw new Error('DeepL API key is required');
  }

  const sourceCode = (from || '').trim().toLowerCase();
  const targetCode = (to || '').trim().toLowerCase();

  if (!sourceCode || !targetCode || sourceCode === targetCode) {
    return '';
  }

  let targetLang = targetCode.toUpperCase();
  if (targetCode === 'en') targetLang = 'EN-US';
  if (targetCode === 'pt') targetLang = 'PT-PT';
  const sourceLang = sourceCode.toUpperCase();

  const isFreeKey = apiKey.endsWith(':fx');
  const endpoint = isFreeKey
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const params = new URLSearchParams({
    text,
    source_lang: sourceLang,
    target_lang: targetLang,
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
    signal,
  });

  if (!response.ok) {
    throw new Error(`DeepL API error: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data?.translations?.[0]?.text) {
    return data.translations[0].text;
  }

  throw new Error('DeepL invalid response');
}

/**
 * High-reliability web fallback translation engine (zero API key needed).
 * Invoked whenever public APIs echo the source text, hit 429 rate limits, or fail.
 */
async function translateWithFallback(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  signal?: AbortSignal
): Promise<string> {
  const sourceCode = (from || '').trim().toLowerCase();
  const targetCode = (to || '').trim().toLowerCase();

  if (!sourceCode || !targetCode || sourceCode === targetCode) {
    return '';
  }

  let sl = sourceCode;
  let tl = targetCode;
  if (sl === 'zh') sl = 'zh-CN';
  if (tl === 'zh') tl = 'zh-CN';

  // Strategy 1: Chrome Extension translation endpoint (ultra fast, high availability)
  try {
    const url1 = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sl}&tl=${tl}&q=${encodeURIComponent(text)}`;
    const res1 = await fetch(url1, { signal });
    if (res1.ok) {
      const data1 = await res1.json();
      if (Array.isArray(data1) && typeof data1[0] === 'string' && data1[0].trim()) {
        return decodeHtmlEntities(data1[0]);
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  // Strategy 2: Google Translate gtx single endpoint
  try {
    const url2 = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const res2 = await fetch(url2, { signal });
    if (res2.ok) {
      const data2 = await res2.json();
      if (Array.isArray(data2) && Array.isArray(data2[0])) {
        const translatedText = data2[0].map((item: any) => item?.[0] || '').join('');
        if (translatedText.trim()) {
          return decodeHtmlEntities(translatedText);
        }
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  throw new Error('All fallback translation strategies failed');
}

/**
 * Main translation dispatcher with caching, strict language pair validation,
 * Smart Dictionary Guard, and echo bug prevention.
 */
export async function translateText(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  settings: EngineSettings,
  signal?: AbortSignal
): Promise<string> {
  const cleanText = text.trim();

  // 1. Strict Language Pair Validation
  if (!cleanText) return '';

  const sourceCode = (from || '').trim().toLowerCase() as LanguageCode;
  const targetCode = (to || '').trim().toLowerCase() as LanguageCode;

  // Prevent any translation request where the source language code matches the target language code
  if (!sourceCode || !targetCode || sourceCode === targetCode) {
    return '';
  }

  // 2. Helper to test if a result is an echo bug
  const isEchoBug = (val: string | null | undefined): boolean => {
    if (!val || !val.trim()) return true;
    return val.trim().toLowerCase() === cleanText.toLowerCase();
  };

  // 3. Check in-memory cache (ignoring any poisoned echo entries)
  const cacheKey = getCacheKey(cleanText, sourceCode, targetCode, settings.provider);
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    if (cached && !isEchoBug(cached)) {
      return cached;
    }
  }

  // 4. Smart Dictionary Guard (zero-latency resolution for vocabulary and common phrases)
  const offlineDirect = lookupOfflineDictionary(cleanText, sourceCode, targetCode);
  if (offlineDirect && !isEchoBug(offlineDirect)) {
    // If the user selected offline provider or word is 1-2 words (like "eten"), return dictionary translation immediately!
    if (settings.provider === 'offline' || cleanText.split(/\s+/).length <= 2) {
      translationCache.set(cacheKey, offlineDirect);
      return offlineDirect;
    }
  }

  if (settings.provider === 'offline') {
    const offlineResult = offlineDirect || '';
    if (offlineResult && !isEchoBug(offlineResult)) {
      translationCache.set(cacheKey, offlineResult);
      return offlineResult;
    }
    return '';
  }

  // 5. Query the chosen primary provider
  let candidateResult = '';
  try {
    if (settings.provider === 'mymemory') {
      candidateResult = await translateWithMyMemory(
        cleanText,
        sourceCode,
        targetCode,
        settings.myMemoryEmail,
        signal
      );
    } else if (settings.provider === 'libretranslate') {
      candidateResult = await translateWithLibreTranslate(
        cleanText,
        sourceCode,
        targetCode,
        settings.libreTranslateUrl,
        settings.libreTranslateKey,
        signal
      );
    } else if (settings.provider === 'deepl') {
      candidateResult = await translateWithDeepL(
        cleanText,
        sourceCode,
        targetCode,
        settings.deepLKey || '',
        signal
      );
    }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw error;
    }
    console.warn(`Translation provider (${settings.provider}) error for "${cleanText}" [${sourceCode} -> ${targetCode}]:`, error?.message);
  }

  // 6. If provider gave a valid, non-echo translation, store and return it
  if (candidateResult && !isEchoBug(candidateResult)) {
    translationCache.set(cacheKey, candidateResult);
    return candidateResult;
  }

  // 7. ECHO BUG OR PROVIDER FAILURE DETECTED:
  // Activate Smart Fallback & Dictionary Guard so common terms never fail!
  console.info(`Echo bug or failure detected for "${cleanText}" [${sourceCode} -> ${targetCode}]. Activating smart fallback.`);

  // Guard Step A: Local offline dictionary lookup
  if (offlineDirect && !isEchoBug(offlineDirect)) {
    translationCache.set(cacheKey, offlineDirect);
    return offlineDirect;
  }
  const secondaryDictionary = lookupOfflineDictionary(cleanText, sourceCode, targetCode);
  if (secondaryDictionary && !isEchoBug(secondaryDictionary)) {
    translationCache.set(cacheKey, secondaryDictionary);
    return secondaryDictionary;
  }

  // Guard Step B: Web fallback translation engine (Google gtx)
  try {
    const fallbackResult = await translateWithFallback(cleanText, sourceCode, targetCode, signal);
    if (fallbackResult && !isEchoBug(fallbackResult)) {
      translationCache.set(cacheKey, fallbackResult);
      return fallbackResult;
    }
  } catch (fallbackError: any) {
    if (fallbackError?.name === 'AbortError') throw fallbackError;
    console.warn(`Fallback translation service failed for [${sourceCode} -> ${targetCode}]:`, fallbackError?.message);
  }

  // If candidateResult was returned by the provider, use it; otherwise avoid raw echo where possible
  return candidateResult || cleanText;
}

export function clearTranslationCache(): void {
  translationCache.clear();
}
