const fs = require('fs');
const path = require('path');

const categories = [
  { key: 'home', file: './categories/home.cjs', label: '1. Essential Everyday Objects & Home' },
  { key: 'food', file: './categories/food.cjs', label: '2. Food, Cooking & Flavors' },
  { key: 'feelings', file: './categories/feelings.cjs', label: '3. Emotions, Mind & Personality Traits' },
  { key: 'travel', file: './categories/travel.cjs', label: '4. Travel, Transport & Urban Life' },
  { key: 'actions', file: './categories/actions.cjs', label: '5. Common Verbs & Core Actions' },
  { key: 'nature', file: './categories/nature.cjs', label: '6. Nature, Animals & Weather' },
  { key: 'business', file: './categories/business.cjs', label: '7. Work, Business & Technology' },
  { key: 'health', file: './categories/health.cjs', label: '8. Health, Body & Well-being' },
  { key: 'society', file: './categories/society.cjs', label: '9. Society, People & Relationships' },
  { key: 'concepts', file: './categories/concepts.cjs', label: '10. Abstract Concepts & Time Expressions' },
];

let allFlashcards = [];
const seenIds = new Set();
let cardCounter = 0;

let fileContent = `import type { Flashcard } from '../types';

/**
 * AkehBoso 300+ Word Master Vocabulary Pool
 * Comprehensive 310-word dictionary bank across 10 essential life & situational categories.
 * Accurately localized across English, German (Deutsch), Dutch (Nederlands), and Indonesian (Bahasa Indonesia).
 */
export const MASTER_MULTI_TOPIC_VOCABULARY_POOL: Flashcard[] = [
`;

categories.forEach(({ key, file, label }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Category file not found: ${filePath}`);
  }
  const items = require(filePath);
  console.log(`Loading ${label}: ${items.length} items`);

  fileContent += `  // =========================================================\n`;
  fileContent += `  // ${label} (${items.length} words)\n`;
  fileContent += `  // =========================================================\n`;

  items.forEach((item) => {
    cardCounter++;
    if (seenIds.has(item.id)) {
      throw new Error(`Duplicate card ID detected: ${item.id}`);
    }
    seenIds.add(item.id);

    const tsTimestamp = 1730000000000 + cardCounter * 1000;

    const cardObj = {
      id: item.id,
      createdAt: tsTimestamp,
      primaryTerm: item.term,
      primaryLang: 'en',
      translations: {
        en: item.term,
        de: item.de,
        nl: item.nl,
        id: item.idLang,
      },
      visual: {
        title: item.title,
        description: item.desc,
        imageUrl: item.img,
        category: key,
      },
      notes: item.notes,
    };

    allFlashcards.push(cardObj);

    fileContent += `  {\n`;
    fileContent += `    id: ${JSON.stringify(cardObj.id)},\n`;
    fileContent += `    createdAt: ${cardObj.createdAt},\n`;
    fileContent += `    primaryTerm: ${JSON.stringify(cardObj.primaryTerm)},\n`;
    fileContent += `    primaryLang: 'en',\n`;
    fileContent += `    translations: {\n`;
    fileContent += `      en: ${JSON.stringify(cardObj.translations.en)},\n`;
    fileContent += `      de: ${JSON.stringify(cardObj.translations.de)},\n`;
    fileContent += `      nl: ${JSON.stringify(cardObj.translations.nl)},\n`;
    fileContent += `      id: ${JSON.stringify(cardObj.translations.id)},\n`;
    fileContent += `    },\n`;
    fileContent += `    visual: {\n`;
    fileContent += `      title: ${JSON.stringify(cardObj.visual.title)},\n`;
    fileContent += `      description: ${JSON.stringify(cardObj.visual.description)},\n`;
    fileContent += `      imageUrl: ${JSON.stringify(cardObj.visual.imageUrl)},\n`;
    fileContent += `      category: ${JSON.stringify(cardObj.visual.category)},\n`;
    fileContent += `    },\n`;
    fileContent += `    notes: ${JSON.stringify(cardObj.notes)},\n`;
    fileContent += `  },\n`;
  });
});

fileContent += `];

export const STARTER_FLASHCARDS = MASTER_MULTI_TOPIC_VOCABULARY_POOL;

/**
 * Fisher-Yates unbiased shuffling algorithm ensuring high entropy randomization.
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns a fresh random package of exactly \`packageSize\` (default: 20) cards
 * chosen strictly from the 300+ card multi-topic master pool using Fisher-Yates shuffle.
 */
export function getRandomPackageDeck(packageSize = 20): Flashcard[] {
  const shuffled = shuffleArray(MASTER_MULTI_TOPIC_VOCABULARY_POOL);
  return shuffled.slice(0, packageSize);
}

/**
 * Backwards-compatibility alias for initial load.
 */
export function getRandomizedStarterDeck(packageSize = 20): Flashcard[] {
  return getRandomPackageDeck(packageSize);
}
`;

const outputPath = path.join(__dirname, '..', 'src', 'constants', 'starterDeck.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`\nSUCCESS: Compiled ${allFlashcards.length} cards across ${categories.length} categories.`);
console.log(`Written to: ${outputPath}`);
