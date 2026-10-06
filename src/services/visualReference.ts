export interface VisualReferenceResult {
  query: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  source: 'unsplash' | 'duckduckgo' | 'curated';
  photographer?: string;
  photographerUrl?: string;
}

const visualCache = new Map<string, VisualReferenceResult>();

// Curated high-resolution equipment database for instant zero-latency responses
const CURATED_EQUIPMENT: Record<string, Partial<VisualReferenceResult>> = {
  oscilloscope: {
    title: 'Digital Storage Oscilloscope',
    description: 'An electronic test instrument that graphically displays varying signal voltages as a two-dimensional plot of one or more signals as a function of time.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  microscope: {
    title: 'Optical Laboratory Microscope',
    description: 'A precision scientific instrument used to view objects that are too small to be seen by the naked eye, using optical lenses for high magnification.',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  centrifuge: {
    title: 'Laboratory Centrifuge',
    description: 'A laboratory device that uses centrifugal force to separate fluids, gases, or liquids based on density through high-speed rotational acceleration.',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  multimeter: {
    title: 'Digital Multimeter',
    description: 'A handheld test tool used to measure two or more electrical values—principally voltage, current, and resistance in electrical and electronic circuits.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  lathe: {
    title: 'Precision Metalworking Lathe',
    description: 'A machining tool that rotates a workpiece about an axis of rotation to perform various operations such as cutting, sanding, knurling, or drilling.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  'wind turbine': {
    title: 'Commercial Wind Turbine',
    description: 'A device that converts the kinetic energy of wind into clean electrical power using aerodynamic rotor blades connected to an electrical generator.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  'solar panel': {
    title: 'Photovoltaic Solar Panel Array',
    description: 'A framework of solar cells mounted together that absorbs sunlight as an energy source to generate direct current electricity.',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  '3d printer': {
    title: 'Additive Manufacturing 3D Printer',
    description: 'A computer-controlled machine that constructs three-dimensional objects by depositing material layer upon layer based on digital 3D models.',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  spectrophotometer: {
    title: 'UV-Vis Spectrophotometer',
    description: 'An analytical instrument that measures the intensity of light as a function of its wavelength absorbed or transmitted through a chemical solution.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
  stethoscope: {
    title: 'Acoustic Medical Stethoscope',
    description: 'An acoustic medical device used by healthcare professionals for auscultation, or listening to the internal sounds of an animal or human body.',
    imageUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80',
    source: 'curated',
  },
};

/**
 * Extracts a concise search noun/keyword from input text
 */
export function extractSearchTerm(text: string): string {
  if (!text) return '';
  const clean = text.trim();
  if (clean.length < 2) return '';

  // If text is short (1-4 words), use directly
  const words = clean.split(/\s+/);
  if (words.length <= 4) {
    return clean.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
  }

  // If longer sentence, extract first few words or subject
  const firstClause = clean.split(/[,.;]/)[0];
  const clauseWords = firstClause.split(/\s+/).slice(0, 3);
  return clauseWords.join(' ').replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
}

/**
 * Fetches visual reference preview via Unsplash NAPI and DuckDuckGo
 */
export async function fetchVisualReference(
  rawQuery: string,
  signal?: AbortSignal
): Promise<VisualReferenceResult | null> {
  const query = extractSearchTerm(rawQuery).toLowerCase();
  if (!query || query.length < 2) return null;

  // 1. Check in-memory cache
  if (visualCache.has(query)) {
    return visualCache.get(query)!;
  }

  // 2. Check curated equipment library
  if (CURATED_EQUIPMENT[query]) {
    const item = CURATED_EQUIPMENT[query];
    const result: VisualReferenceResult = {
      query,
      title: item.title || query.toUpperCase(),
      description: item.description || `Technical equipment reference for ${query}`,
      imageUrl: item.imageUrl!,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl!,
      source: 'curated',
    };
    visualCache.set(query, result);
    return result;
  }

  // 3. Query Unsplash Photo API
  try {
    const unsplashUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1`;
    const res = await fetch(unsplashUrl, { signal });
    if (res.ok) {
      const data = await res.json();
      const firstHit = data?.results?.[0];
      if (firstHit?.urls?.regular) {
        const title = firstHit.alt_description || firstHit.description || query.charAt(0).toUpperCase() + query.slice(1);
        const result: VisualReferenceResult = {
          query,
          title: title.length > 60 ? title.slice(0, 60) + '...' : title,
          description: firstHit.description || firstHit.alt_description || `Visual reference preview for ${query}.`,
          imageUrl: firstHit.urls.regular,
          thumbnailUrl: firstHit.urls.small || firstHit.urls.regular,
          source: 'unsplash',
          photographer: firstHit.user?.name,
          photographerUrl: firstHit.user?.links?.html,
        };
        visualCache.set(query, result);
        return result;
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  // 4. Fallback to DuckDuckGo Instant Answer
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
    const res = await fetch(ddgUrl, { signal });
    if (res.ok) {
      const data = await res.json();
      if (data.Image) {
        const fullImage = data.Image.startsWith('http')
          ? data.Image
          : `https://duckduckgo.com${data.Image}`;
        const result: VisualReferenceResult = {
          query,
          title: data.Heading || query.charAt(0).toUpperCase() + query.slice(1),
          description: data.Abstract || `Visual reference inspection for ${query}.`,
          imageUrl: fullImage,
          thumbnailUrl: fullImage,
          source: 'duckduckgo',
        };
        visualCache.set(query, result);
        return result;
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  return null;
}
