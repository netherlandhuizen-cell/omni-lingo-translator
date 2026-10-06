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
    return text.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  const parser = document.createElement('textarea');
  parser.innerHTML = text;
  return parser.value;
}

/**
 * Generates a unique cache key for a given translation request
 */
function getCacheKey(text: string, from: LanguageCode, to: LanguageCode, provider: string): string {
  return `${provider}:${from}->${to}:${text.trim().toLowerCase()}`;
}

/**
 * ============================================================================
 * TRANSLATION PROVIDER ENGINES
 * ============================================================================
 * 
 * NOTE TO DEVELOPERS / SCALING UP:
 * 
 * 1. MyMemory API (Default Free Tier):
 *    - Free, no API key needed for basic usage (up to ~5,000 words/day).
 *    - To increase limit to 50,000 words/day, pass an email parameter `de=your_email@example.com`
 *      or register for an API key at https://mymemory.translated.net/doc/keygen.php
 * 
 * 2. LibreTranslate:
 *    - Open-source, self-hostable translation engine.
 *    - Public instances or your self-hosted instance (e.g. https://translate.terraprint.co or localhost:5000)
 *    - Pass API key in body/headers if enabled.
 * 
 * 3. DeepL API:
 *    - Enter your DeepL Auth Key (Free or Pro) from https://www.deepl.com/pro-api
 *    - Endpoint: https://api-free.deepl.com/v2/translate or https://api.deepl.com/v2/translate
 * 
 * ============================================================================
 */

/**
 * MyMemory API Translation
 */
async function translateWithMyMemory(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  email?: string,
  signal?: AbortSignal
): Promise<string> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${from}|${to}`,
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
    let translated = data.responseData.translatedText;
    
    // Check if MyMemory returned a rate limit quota notification
    if (typeof translated === 'string' && translated.includes('MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS')) {
      throw new Error('MyMemory daily quota exceeded. Falling back to offline dictionary.');
    }

    // If matches are provided, see if a higher quality machine-translation or verified translation exists
    if (Array.isArray(data.matches) && data.matches.length > 1) {
      // Look for matches by MateCat or high quality with valid translation
      const verifiedMatch = data.matches.find(
        (m: any) =>
          m.translation &&
          m.translation.toLowerCase() !== text.toLowerCase() &&
          (m['created-by'] === 'MateCat' || Number(m.quality) >= 70)
      );
      if (verifiedMatch?.translation && !verifiedMatch.translation.startsWith('http')) {
        translated = verifiedMatch.translation;
      }
    }

    return decodeHtmlEntities(translated);
  }

  throw new Error(data?.responseDetails || 'MyMemory translation failed');
}

/**
 * LibreTranslate API Translation
 */
async function translateWithLibreTranslate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  endpointUrl: string = 'https://libretranslate.com',
  apiKey?: string,
  signal?: AbortSignal
): Promise<string> {
  const url = `${endpointUrl.replace(/\/$/, '')}/translate`;
  
  const payload: Record<string, string> = {
    q: text,
    source: from,
    target: to,
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
 * DeepL API Translation
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

  const targetLang = to === 'en' ? 'EN-US' : to.toUpperCase();
  const sourceLang = from.toUpperCase();

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
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
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
 * Main translation dispatcher with caching, provider switching, and offline fallback.
 */
export async function translateText(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  settings: EngineSettings,
  signal?: AbortSignal
): Promise<string> {
  const cleanText = text.trim();

  // Empty or same language: return immediately
  if (!cleanText) return '';
  if (from === to) return text;

  // 1. Check in-memory cache
  const cacheKey = getCacheKey(cleanText, from, to, settings.provider);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // 2. Check offline dictionary for instantaneous zero-latency match
  const offlineDirect = lookupOfflineDictionary(cleanText, from, to);
  if (offlineDirect && settings.provider === 'offline') {
    translationCache.set(cacheKey, offlineDirect);
    return offlineDirect;
  }

  if (settings.provider === 'offline') {
    const offlineResult = offlineDirect || cleanText;
    translationCache.set(cacheKey, offlineResult);
    return offlineResult;
  }

  // 3. Query the selected provider
  try {
    let result = '';

    if (settings.provider === 'mymemory') {
      // If we have an exact dictionary match for common phrases, return it instantly to preserve API quota
      if (offlineDirect) {
        translationCache.set(cacheKey, offlineDirect);
        return offlineDirect;
      }
      result = await translateWithMyMemory(cleanText, from, to, settings.myMemoryEmail, signal);
    } else if (settings.provider === 'libretranslate') {
      result = await translateWithLibreTranslate(
        cleanText,
        from,
        to,
        settings.libreTranslateUrl,
        settings.libreTranslateKey,
        signal
      );
    } else if (settings.provider === 'deepl') {
      result = await translateWithDeepL(cleanText, from, to, settings.deepLKey || '', signal);
    }

    if (result) {
      translationCache.set(cacheKey, result);
      return result;
    }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw error;
    }

    console.warn(`Translation API failed (${error?.message}). Trying offline dictionary fallback.`);

    // Graceful offline fallback
    const offlineResult = lookupOfflineDictionary(cleanText, from, to);
    if (offlineResult) {
      translationCache.set(cacheKey, offlineResult);
      return offlineResult;
    }

    return cleanText;
  }

  return cleanText;
}

export function clearTranslationCache(): void {
  translationCache.clear();
}
