import type { Flashcard } from '../types';

export const STARTER_FLASHCARDS: Flashcard[] = [
  // ---------------------------------------------------------
  // 1. Daily / Office Life
  // ---------------------------------------------------------
  {
    id: 'starter-meeting',
    createdAt: 1730000001000,
    primaryTerm: 'Meeting',
    primaryLang: 'en',
    translations: {
      en: 'Meeting',
      de: 'Besprechung',
      nl: 'Vergadering',
      id: 'Rapat',
    },
    visual: {
      title: 'Collaborative Team Meeting',
      description: 'Gathering of colleagues or stakeholders to align on milestones, solve problems, and strategize.',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      category: 'office',
    },
    notes: 'Daily workplace collaboration and strategy session.',
  },
  {
    id: 'starter-deadline',
    createdAt: 1730000002000,
    primaryTerm: 'Deadline',
    primaryLang: 'en',
    translations: {
      en: 'Deadline',
      de: 'Abgabefrist',
      nl: 'Deadline',
      id: 'Batas Waktu',
    },
    visual: {
      title: 'Project Milestone Deadline',
      description: 'The agreed target date or time by which a task or deliverable must be completed.',
      imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
      category: 'office',
    },
    notes: 'Target completion milestone in project management.',
  },
  {
    id: 'starter-workspace',
    createdAt: 1730000003000,
    primaryTerm: 'Workspace',
    primaryLang: 'en',
    translations: {
      en: 'Workspace',
      de: 'Arbeitsplatz',
      nl: 'Werkplek',
      id: 'Ruang Kerja',
    },
    visual: {
      title: 'Ergonomic Digital Workspace',
      description: 'An organized physical or digital working environment optimized for focus and productivity.',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      category: 'office',
    },
    notes: 'Dedicated productive desk and office setup.',
  },
  {
    id: 'starter-coffee-break',
    createdAt: 1730000004000,
    primaryTerm: 'Coffee Break',
    primaryLang: 'en',
    translations: {
      en: 'Coffee Break',
      de: 'Kaffeepause',
      nl: 'Koffiepauze',
      id: 'Istirahat Kopi',
    },
    visual: {
      title: 'Artisan Coffee Break',
      description: 'Short restorative pause during work hours to unwind, socialize, and recharge mental clarity.',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      category: 'office',
    },
    notes: 'Essential daily restorative pause.',
  },

  // ---------------------------------------------------------
  // 2. Travel & Logistics
  // ---------------------------------------------------------
  {
    id: 'starter-archipelago',
    createdAt: 1730000005000,
    primaryTerm: 'Archipelago',
    primaryLang: 'en',
    translations: {
      en: 'Archipelago',
      de: 'Inselgruppe',
      nl: 'Archipel',
      id: 'Kepulauan',
    },
    visual: {
      title: 'Tropical Island Archipelago',
      description: 'An extensive group or cluster of islands scattered across an ocean or tropical sea.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      category: 'travel',
    },
    notes: 'The geographic and cultural identity of Nusantara.',
  },
  {
    id: 'starter-departure',
    createdAt: 1730000006000,
    primaryTerm: 'Departure',
    primaryLang: 'en',
    translations: {
      en: 'Departure',
      de: 'Abflug',
      nl: 'Vertrek',
      id: 'Keberangkatan',
    },
    visual: {
      title: 'Airport Departure Terminal',
      description: 'The scheduled time and act of leaving an airport or station to begin a voyage.',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
      category: 'travel',
    },
    notes: 'Primary transit milestone in global logistics.',
  },
  {
    id: 'starter-customs',
    createdAt: 1730000007000,
    primaryTerm: 'Customs',
    primaryLang: 'en',
    translations: {
      en: 'Customs',
      de: 'Zoll',
      nl: 'Douane',
      id: 'Bea Cukai',
    },
    visual: {
      title: 'International Customs Clearance',
      description: 'Government agency inspecting travelers and cargo moving across international borders.',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      category: 'travel',
    },
    notes: 'Cross-border import/export and passport clearance.',
  },
  {
    id: 'starter-luggage',
    createdAt: 1730000008000,
    primaryTerm: 'Luggage',
    primaryLang: 'en',
    translations: {
      en: 'Luggage',
      de: 'Reisegepäck',
      nl: 'Bagage',
      id: 'Bagasi',
    },
    visual: {
      title: 'Travel Suitcases & Baggage',
      description: 'Suitcases, backpacks, and containers carrying personal goods during transit.',
      imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80',
      category: 'travel',
    },
    notes: 'Essential gear for passenger journeys.',
  },
  {
    id: 'starter-harbor',
    createdAt: 1730000009000,
    primaryTerm: 'Harbor',
    primaryLang: 'en',
    translations: {
      en: 'Harbor',
      de: 'Seehafen',
      nl: 'Zeehaven',
      id: 'Pelabuhan',
    },
    visual: {
      title: 'Maritime Coastal Harbor',
      description: 'Sheltered body of coastal water where cargo ships and ferries dock to load and unload.',
      imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80',
      category: 'travel',
    },
    notes: 'Vital maritime nexus connecting islands.',
  },

  // ---------------------------------------------------------
  // 3. Nature & Environment
  // ---------------------------------------------------------
  {
    id: 'starter-horizon',
    createdAt: 1730000010000,
    primaryTerm: 'Horizon',
    primaryLang: 'en',
    translations: {
      en: 'Horizon',
      de: 'Horizont',
      nl: 'Horizon',
      id: 'Cakrawala',
    },
    visual: {
      title: 'Ocean Sunset Horizon',
      description: 'The distant visible boundary where the earth surface and the sky appear to meet.',
      imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80',
      category: 'nature',
    },
    notes: 'Expansive scenic boundary line across the sea.',
  },
  {
    id: 'starter-tide',
    createdAt: 1730000011000,
    primaryTerm: 'Tide',
    primaryLang: 'en',
    translations: {
      en: 'Tide',
      de: 'Gezeiten',
      nl: 'Getijde',
      id: 'Pasang Surut',
    },
    visual: {
      title: 'Coastal Ocean Tides',
      description: 'The periodic rise and fall of coastal sea levels driven by lunar and solar gravitational forces.',
      imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80',
      category: 'nature',
    },
    notes: 'Rhythmic sea fluctuation governing maritime navigation.',
  },
  {
    id: 'starter-rainforest',
    createdAt: 1730000012000,
    primaryTerm: 'Rainforest',
    primaryLang: 'en',
    translations: {
      en: 'Rainforest',
      de: 'Regenwald',
      nl: 'Regenwoud',
      id: 'Hutan Hujan',
    },
    visual: {
      title: 'Tropical Canopy Rainforest',
      description: 'Dense tropical forest with rich biodiversity and abundant rainfall throughout the year.',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      category: 'nature',
    },
    notes: 'Crucial ecosystem and ecological sanctuary.',
  },

  // ---------------------------------------------------------
  // 4. General Technical & Tools
  // ---------------------------------------------------------
  {
    id: 'starter-wrench',
    createdAt: 1730000013000,
    primaryTerm: 'Wrench',
    primaryLang: 'en',
    translations: {
      en: 'Wrench',
      de: 'Schraubenschlüssel',
      nl: 'Moersleutel',
      id: 'Kunci Pas',
    },
    visual: {
      title: 'Mechanical Adjustable Wrench',
      description: 'Hand tool designed to provide mechanical grip and torque for turning nuts and bolts.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      category: 'tools',
    },
    notes: 'Foundational mechanical fastening and repair tool.',
  },
  {
    id: 'starter-circuit',
    createdAt: 1730000014000,
    primaryTerm: 'Circuit',
    primaryLang: 'en',
    translations: {
      en: 'Circuit',
      de: 'Stromkreis',
      nl: 'Stroomkring',
      id: 'Rangkaian Listrik',
    },
    visual: {
      title: 'Electronic Printed Circuit',
      description: 'Closed conductive loop through which electrical current flows to power components.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      category: 'tools',
    },
    notes: 'Fundamental building block of electronic devices.',
  },
  {
    id: 'starter-blueprint',
    createdAt: 1730000015000,
    primaryTerm: 'Blueprint',
    primaryLang: 'en',
    translations: {
      en: 'Blueprint',
      de: 'Bauplan',
      nl: 'Bouwtekening',
      id: 'Cetak Biru',
    },
    visual: {
      title: 'Technical Architectural Blueprint',
      description: 'Detailed schematic drawing outlining dimensional specifications and engineering design.',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      category: 'tools',
    },
    notes: 'Architectural and structural engineering guide.',
  },
  {
    id: 'starter-gauge',
    createdAt: 1730000016000,
    primaryTerm: 'Pressure Gauge',
    primaryLang: 'en',
    translations: {
      en: 'Pressure Gauge',
      de: 'Manometer',
      nl: 'Drukmeter',
      id: 'Alat Ukur Tekanan',
    },
    visual: {
      title: 'Industrial Hydraulic Pressure Gauge',
      description: 'Precision dial instrument measuring the pressure of liquid or gas in closed systems.',
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
      category: 'tools',
    },
    notes: 'Instrument for monitoring hydraulic and pneumatic systems.',
  },
  {
    id: 'starter-excavator',
    createdAt: 1730000017000,
    primaryTerm: 'Excavator',
    primaryLang: 'en',
    translations: {
      en: 'Excavator',
      de: 'Bagger',
      nl: 'Graafmachine',
      id: 'Ekskavator',
    },
    visual: {
      title: 'Heavy Hydraulic Excavator',
      description: 'Heavy construction vehicle designed for earthmoving, digging trenches, and materials handling.',
      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      category: 'construction',
    },
    notes: 'Primary heavy earthmoving equipment on construction sites.',
  },
  {
    id: 'starter-helmet',
    createdAt: 1730000018000,
    primaryTerm: 'Safety Helmet',
    primaryLang: 'en',
    translations: {
      en: 'Safety Helmet',
      de: 'Schutzhelm',
      nl: 'Veiligheidshelm',
      id: 'Helm Keselamatan',
    },
    visual: {
      title: 'Industrial Safety Helmet & PPE',
      description: 'Rigid protective headgear designed to safeguard site personnel against falling debris and impact.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      category: 'construction',
    },
    notes: 'Mandatory Personal Protective Equipment (PPE).',
  },
];

/**
 * Returns a randomized copy of the starter deck so active recall training
 * begins with fresh, diverse cards across categories every time.
 */
export function getRandomizedStarterDeck(): Flashcard[] {
  const deck = [...STARTER_FLASHCARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
