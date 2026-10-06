import type { IndustryCategory } from '../types';
import { INDUSTRY_CATEGORIES } from '../constants/industries';

export interface VisualReferenceResult {
  query: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  fallbackUrl: string;
  source: 'wikimedia' | 'curated' | 'generated';
  category: IndustryCategory;
  photographer?: string;
}

const visualCache = new Map<string, VisualReferenceResult>();

// Curated high-resolution laboratory, construction, manufacturing & electrical equipment database
const CURATED_EQUIPMENT: Record<string, Partial<VisualReferenceResult>> = {
  // Construction
  excavator: {
    title: 'Heavy Hydraulic Excavator',
    description: 'Heavy construction equipment consisting of a boom, dipper, bucket, and cab on a rotating platform atop tracks or wheels, designed for digging and earthmoving.',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'construction',
  },
  bagger: {
    title: 'Hydraulikbagger (Excavator)',
    description: 'Eine Baumaschine zum Lösen und Bewegen von Boden und anderen Massen.',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'construction',
  },
  bulldozer: {
    title: 'Crawler Bulldozer',
    description: 'A large, motorized machine equipped with a substantial metal plate used to push large quantities of soil, sand, rubble, or other material during construction work.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'construction',
  },
  crane: {
    title: 'Tower & Mobile Crane',
    description: 'A tall machine used for moving heavy objects, typically by suspending them from a projecting arm or beam.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'construction',
  },
  forklift: {
    title: 'Industrial Counterbalance Forklift',
    description: 'A powered industrial truck used to lift and move materials over short distances in warehouses and construction yards.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'construction',
  },

  // Electrical & Tools
  oscilloscope: {
    title: 'Digital Storage Oscilloscope',
    description: 'An electronic test instrument that graphically displays varying signal voltages as a two-dimensional plot of one or more signals as a function of time.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'electrical',
  },
  multimeter: {
    title: 'Digital Multimeter',
    description: 'A handheld test tool used to measure two or more electrical values—principally voltage, current, and resistance in electrical circuits.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'electrical',
  },
  'solar panel': {
    title: 'Photovoltaic Solar Panel Array',
    description: 'A framework of solar cells mounted together that absorbs sunlight as an energy source to generate direct current electricity.',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'electrical',
  },
  'wind turbine': {
    title: 'Commercial Wind Turbine',
    description: 'A device that converts the kinetic energy of wind into clean electrical power using aerodynamic rotor blades connected to an electrical generator.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'electrical',
  },

  // Laboratory & Scientific
  microscope: {
    title: 'Optical Laboratory Microscope',
    description: 'A precision scientific instrument used to view objects that are too small to be seen by the naked eye, using optical lenses for high magnification.',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'laboratory',
  },
  centrifuge: {
    title: 'Laboratory Centrifuge',
    description: 'A laboratory device that uses centrifugal force to separate fluids, gases, or liquids based on density through high-speed rotational acceleration.',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'laboratory',
  },
  spectrophotometer: {
    title: 'UV-Vis Spectrophotometer',
    description: 'An analytical instrument that measures the intensity of light as a function of its wavelength absorbed or transmitted through a chemical solution.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'laboratory',
  },
  stethoscope: {
    title: 'Acoustic Medical Stethoscope',
    description: 'An acoustic medical device used by healthcare professionals for auscultation, or listening to the internal sounds of an animal or human body.',
    imageUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'laboratory',
  },

  // Manufacturing & Industrial
  lathe: {
    title: 'Precision Metalworking Lathe',
    description: 'A machining tool that rotates a workpiece about an axis of rotation to perform various operations such as cutting, sanding, knurling, or drilling.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'manufacturing',
  },
  '3d printer': {
    title: 'Additive Manufacturing 3D Printer',
    description: 'A computer-controlled machine that constructs three-dimensional objects by depositing material layer upon layer based on digital 3D models.',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
    category: 'manufacturing',
  },
};

const MODIFIERS_AND_STOPWORDS = new Set([
  // Articles & Demonstratives
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their', 'his', 'her',
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'dieser', 'diese', 'dieses',
  'de', 'het', 'een', 'deze', 'dit', 'mijn', 'jouw', 'ons',
  'sebuah', 'ini', 'itu', 'yang', 'si', 'sang',

  // Modifiers & Adjectives (like "mobile", "portable", "new", etc.)
  'mobile', 'portable', 'handheld', 'compact', 'mini', 'micro', 'macro',
  'mobiler', 'mobiles', 'mobile', 'mobil', 'tragbar', 'tragbarer', 'tragbare',
  'mobiele', 'mobiel', 'draagbaar', 'draagbare', 'compacte',
  'bergerak', 'portabel', 'genggam',

  'digital', 'analog', 'electric', 'electrical', 'electronic', 'mechanical', 'manual', 'automatic',
  'digitaler', 'digitales', 'elektrisch', 'elektrischer', 'automatisch', 'manuell',
  'elektrische', 'automatische', 'otomatis', 'listrik', 'elektronik',

  'new', 'old', 'used', 'heavy', 'light', 'big', 'small', 'large', 'tiny', 'huge',
  'neu', 'neuer', 'neues', 'alt', 'alter', 'altes', 'klein', 'kleiner', 'groß', 'großer', 'schwer', 'schwerer',
  'nieuwe', 'nieuw', 'oude', 'oud', 'kleine', 'klein', 'grote', 'groot', 'zwaar', 'zware',
  'baru', 'lama', 'bekas', 'kecil', 'besar', 'berat', 'ringan',

  'cheap', 'expensive', 'good', 'best', 'fast', 'slow', 'smart', 'high', 'low',
  'billig', 'teuer', 'gut', 'bester', 'schnell', 'klug',
  'goedkoop', 'duur', 'goed', 'beste', 'snel',
  'murah', 'mahal', 'bagus', 'terbaik', 'cepat',

  'industrial', 'commercial', 'laboratory', 'scientific', 'medical', 'professional',
  'industriell', 'wissenschaftlich', 'medizinisch', 'professionell',
  'industrieel', 'wetenschappelijk', 'medisch',
  'industri', 'ilmiah', 'medis', 'laboratorium',

  // Conversational filler & Question stems
  'how', 'much', 'does', 'cost', 'where', 'is', 'are', 'what', 'can', 'you', 'give', 'me',
  'we', 'need', 'i', 'want', 'buy', 'please', 'for', 'to', 'in', 'of', 'and', 'or', 'with', 'at', 'on',
  'wie', 'viel', 'kostet', 'wo', 'ist', 'sind', 'was', 'können', 'sie', 'mir', 'geben',
  'wir', 'brauchen', 'ich', 'möchte', 'kaufen', 'bitte', 'für', 'und', 'mit',
  'hoe', 'veel', 'kost', 'waar', 'wat', 'kunt', 'u', 'geven', 'nodig', 'wil', 'kopen', 'alstublieft', 'voor', 'en', 'met',
  'berapa', 'harga', 'mana', 'ada', 'apa', 'bisakah', 'anda', 'memberi', 'saya', 'butuh', 'ingin', 'beli', 'tolong', 'untuk', 'dan', 'dengan'
]);

/**
 * Strips out modifier words, fillers, and articles so the query
 * focuses exclusively on the core technical noun (e.g. "excavator mobile" -> "excavator").
 */
export function cleanSearchNoun(text: string): string {
  if (!text) return '';
  const clean = text.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');
  const tokens = clean.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '';

  // Filter out modifiers and filler words
  const meaningful = tokens.filter((t) => !MODIFIERS_AND_STOPWORDS.has(t));

  // If everything was filtered, fall back to last token
  if (meaningful.length === 0) {
    return tokens[tokens.length - 1];
  }

  // Return the core 1-2 word noun phrase
  return meaningful.slice(0, 2).join(' ');
}

export const extractSearchTerm = cleanSearchNoun;

/**
 * Clean and normalize Wikimedia thumbnail URLs to prevent 404s
 */
function sanitizeWikimediaUrl(url: string): string {
  if (!url) return '';
  // Remove trailing query params that may cause 404s on dynamic renderers
  return url.split('?')[0];
}

/**
 * Fetches visual reference preview via Wikimedia Commons CORS generator API
 * with relevance ranking, modifier stripping, industry theme biasing, and reliable fallback.
 */
export async function fetchVisualReference(
  rawQuery: string,
  category: IndustryCategory = 'auto',
  signal?: AbortSignal
): Promise<VisualReferenceResult | null> {
  const coreNoun = cleanSearchNoun(rawQuery);
  if (!coreNoun || coreNoun.length < 2) return null;

  const cacheKey = `${category}:${coreNoun}`;

  // 1. Check in-memory cache
  if (visualCache.has(cacheKey)) {
    return visualCache.get(cacheKey)!;
  }

  // Guaranteed fallback image URL in case Wikimedia image 404s
  const guaranteedFallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(coreNoun + ' equipment machine product photography studio lighting') }?width=800&height=500&nologo=true`;

  // 2. Check curated equipment library for instant high-res response
  if (CURATED_EQUIPMENT[coreNoun]) {
    const item = CURATED_EQUIPMENT[coreNoun];
    const result: VisualReferenceResult = {
      query: coreNoun,
      title: item.title || coreNoun.toUpperCase(),
      description: item.description || `Technical equipment reference for ${coreNoun}`,
      imageUrl: item.imageUrl!,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl!,
      fallbackUrl: item.fallbackUrl || guaranteedFallbackUrl,
      source: 'curated',
      category: item.category || category,
    };
    visualCache.set(cacheKey, result);
    return result;
  }

  // 3. Prepare search query with industry category bias if specified
  let searchTerms = coreNoun;
  if (category !== 'auto') {
    const bias = INDUSTRY_CATEGORIES[category]?.biasTerms || '';
    searchTerms = `${coreNoun} ${bias}`;
  }

  // 4. Query Wikimedia Commons API with search ranking and thumbnail precision
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&exintro&explaintext&exsentences=2&pithumbsize=800&generator=search&gsrsearch=${encodeURIComponent(searchTerms)}&gsrlimit=6`;
    const res = await fetch(wikiUrl, { signal });
    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {}) as any[];

      if (pages.length > 0) {
        // Sort by Wikipedia's search relevance index
        pages.sort((a, b) => (a.index || 99) - (b.index || 99));

        // Filter out disambiguation and company/manufacturer profile pages
        const validCandidates = pages.filter((p) => {
          if (!p.thumbnail?.source) return false;
          const t = p.title.toLowerCase();
          if (t.includes('(disambiguation)') || t.includes('manufacturer') || t.includes('(company)')) {
            return false;
          }
          return true;
        });

        // Priority A: Exact title match or title starting with the core noun
        let selectedHit = validCandidates.find((p) => {
          const t = p.title.toLowerCase();
          return t === coreNoun || t.startsWith(coreNoun);
        });

        // Priority B: Any valid candidate containing the core noun
        if (!selectedHit) {
          selectedHit = validCandidates.find((p) => p.title.toLowerCase().includes(coreNoun));
        }

        // Priority C: Highest ranked candidate with a thumbnail
        if (!selectedHit && validCandidates.length > 0) {
          selectedHit = validCandidates[0];
        }

        if (selectedHit && selectedHit.thumbnail?.source) {
          const cleanThumb = sanitizeWikimediaUrl(selectedHit.thumbnail.source);
          const result: VisualReferenceResult = {
            query: coreNoun,
            title: selectedHit.title || coreNoun.charAt(0).toUpperCase() + coreNoun.slice(1),
            description: selectedHit.extract || `Verified visual reference for ${selectedHit.title || coreNoun}.`,
            imageUrl: cleanThumb,
            thumbnailUrl: cleanThumb,
            fallbackUrl: guaranteedFallbackUrl,
            source: 'wikimedia',
            category,
          };
          visualCache.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    console.warn('Wikimedia lookup failed, using fallback:', err);
  }

  // 5. Reliable open photographic fallback with clean isolated product prompt
  const fallbackResult: VisualReferenceResult = {
    query: coreNoun,
    title: coreNoun.charAt(0).toUpperCase() + coreNoun.slice(1),
    description: `Visual reference inspection for "${coreNoun}".`,
    imageUrl: guaranteedFallbackUrl,
    thumbnailUrl: guaranteedFallbackUrl,
    fallbackUrl: guaranteedFallbackUrl,
    source: 'generated',
    category,
  };

  visualCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}
