import type { LanguageCode } from '../types';

export interface PhraseEntry {
  en: string;
  de: string;
  nl: string;
  id: string;
}

export const COMMON_PHRASES: PhraseEntry[] = [
  {
    en: 'hello',
    de: 'hallo',
    nl: 'hallo',
    id: 'halo'
  },
  {
    en: 'hello world',
    de: 'hallo welt',
    nl: 'hallo wereld',
    id: 'halo dunia'
  },
  {
    en: 'good morning',
    de: 'guten morgen',
    nl: 'goedemorgen',
    id: 'selamat pagi'
  },
  {
    en: 'good afternoon',
    de: 'guten tag',
    nl: 'goedemiddag',
    id: 'selamat siang'
  },
  {
    en: 'good evening',
    de: 'guten abend',
    nl: 'goedenavond',
    id: 'selamat sore'
  },
  {
    en: 'good night',
    de: 'gute nacht',
    nl: 'goedenacht',
    id: 'selamat malam'
  },
  {
    en: 'how are you?',
    de: 'wie geht es dir?',
    nl: 'hoe gaat het met je?',
    id: 'bagaimana kabarmu?'
  },
  {
    en: 'how are you',
    de: 'wie geht es dir',
    nl: 'hoe gaat het',
    id: 'bagaimana kabar anda'
  },
  {
    en: 'i am fine, thank you',
    de: 'mir geht es gut, danke',
    nl: 'het gaat goed, dank je',
    id: 'saya baik-baik saja, terima kasih'
  },
  {
    en: 'thank you',
    de: 'danke',
    nl: 'dank je',
    id: 'terima kasih'
  },
  {
    en: 'thank you very much',
    de: 'vielen dank',
    nl: 'hartelijk dank',
    id: 'terima kasih banyak'
  },
  {
    en: 'you are welcome',
    de: 'gern geschehen',
    nl: 'graag gedaan',
    id: 'sama-sama'
  },
  {
    en: 'please',
    de: 'bitte',
    nl: 'alstublieft',
    id: 'tolong / silakan'
  },
  {
    en: 'yes',
    de: 'ja',
    nl: 'ja',
    id: 'ya'
  },
  {
    en: 'no',
    de: 'nein',
    nl: 'nee',
    id: 'tidak'
  },
  {
    en: 'goodbye',
    de: 'auf wiedersehen',
    nl: 'tot ziens',
    id: 'selamat tinggal'
  },
  {
    en: 'see you later',
    de: 'bis später',
    nl: 'tot later',
    id: 'sampai jumpa lagi'
  },
  {
    en: 'welcome',
    de: 'willkommen',
    nl: 'welkom',
    id: 'selamat datang'
  },
  {
    en: 'what is your name?',
    de: 'wie heißt du?',
    nl: 'hoe heet je?',
    id: 'siapa namamu?'
  },
  {
    en: 'my name is',
    de: 'mein name ist',
    nl: 'mijn naam is',
    id: 'nama saya adalah'
  },
  {
    en: 'nice to meet you',
    de: 'schön, sie kennenzulernen',
    nl: 'aangenaam kennis te maken',
    id: 'senang bertemu denganmu'
  },
  {
    en: 'excuse me',
    de: 'entschuldigung',
    nl: 'pardon',
    id: 'permisi'
  },
  {
    en: 'sorry',
    de: 'entschuldigung',
    nl: 'sorry',
    id: 'maaf'
  },
  {
    en: 'i do not understand',
    de: 'ich verstehe nicht',
    nl: 'ik begrijp het niet',
    id: 'saya tidak mengerti'
  },
  {
    en: 'do you speak english?',
    de: 'sprechen sie englisch?',
    nl: 'spreekt u engels?',
    id: 'apakah anda berbicara bahasa inggris?'
  },
  {
    en: 'where is the nearest train station?',
    de: 'wo ist der nächste bahnhof?',
    nl: 'waar is het dichtstbijzijnde treinstation?',
    id: 'di mana stasiun kereta terdekat?'
  },
  {
    en: 'where is the bathroom?',
    de: 'wo ist die toilette?',
    nl: 'waar is het toilet?',
    id: 'di mana toiletnya?'
  },
  {
    en: 'how much is this?',
    de: 'wie viel kostet das?',
    nl: 'hoeveel kost dit?',
    id: 'berapa harganya ini?'
  },
  {
    en: 'have a great day',
    de: 'schönen tag noch',
    nl: 'fijne dag nog',
    id: 'semoga harimu menyenangkan'
  },
  {
    en: 'peace and love',
    de: 'frieden und liebe',
    nl: 'vrede en liefde',
    id: 'damai dan cinta'
  }
];

export const WORD_MAP: Record<string, Partial<Record<LanguageCode, string>>> = {
  'good': { en: 'good', de: 'gut', nl: 'goed', id: 'baik' },
  'bad': { en: 'bad', de: 'schlecht', nl: 'slecht', id: 'buruk' },
  'morning': { en: 'morning', de: 'Morgen', nl: 'ochtend', id: 'pagi' },
  'day': { en: 'day', de: 'Tag', nl: 'dag', id: 'hari' },
  'night': { en: 'night', de: 'Nacht', nl: 'nacht', id: 'malam' },
  'sun': { en: 'sun', de: 'Sonne', nl: 'zon', id: 'matahari' },
  'moon': { en: 'moon', de: 'Mond', nl: 'maan', id: 'bulan' },
  'water': { en: 'water', de: 'Wasser', nl: 'water', id: 'air' },
  'food': { en: 'food', de: 'Essen', nl: 'voedsel', id: 'makanan' },
  'coffee': { en: 'coffee', de: 'Kaffee', nl: 'koffie', id: 'kopi' },
  'tea': { en: 'tea', de: 'Tee', nl: 'thee', id: 'teh' },
  'friend': { en: 'friend', de: 'Freund', nl: 'vriend', id: 'teman' },
  'family': { en: 'family', de: 'Familie', nl: 'familie', id: 'keluarga' },
  'love': { en: 'love', de: 'Liebe', nl: 'liefde', id: 'cinta' },
  'happy': { en: 'happy', de: 'glücklich', nl: 'blij', id: 'senang' },
  'beautiful': { en: 'beautiful', de: 'wunderschön', nl: 'mooi', id: 'indah' },
  'home': { en: 'home', de: 'Zuhause', nl: 'thuis', id: 'rumah' },
  'house': { en: 'house', de: 'Haus', nl: 'huis', id: 'rumah' },
  'city': { en: 'city', de: 'Stadt', nl: 'stad', id: 'kota' },
  'world': { en: 'world', de: 'Welt', nl: 'wereld', id: 'dunia' },
  'book': { en: 'book', de: 'Buch', nl: 'boek', id: 'buku' },
  'music': { en: 'music', de: 'Musik', nl: 'muziek', id: 'musik' },
  'time': { en: 'time', de: 'Zeit', nl: 'tijd', id: 'waktu' },
  'today': { en: 'today', de: 'heute', nl: 'vandaag', id: 'hari ini' },
  'tomorrow': { en: 'tomorrow', de: 'morgen', nl: 'morgen', id: 'besok' },
  'yesterday': { en: 'yesterday', de: 'gestern', nl: 'gisteren', id: 'kemarin' },
  'help': { en: 'help', de: 'Hilfe', nl: 'hulp', id: 'bantuan' },
  'work': { en: 'work', de: 'Arbeit', nl: 'werk', id: 'pekerjaan' },
  'life': { en: 'life', de: 'Leben', nl: 'leven', id: 'hidup' },
  'road': { en: 'road', de: 'Straße', nl: 'weg', id: 'jalan' },
  'money': { en: 'money', de: 'Geld', nl: 'geld', id: 'uang' },
  'excavator': { en: 'excavator', de: 'Bagger', nl: 'graafmachine', id: 'ekskavator' },
  'bagger': { en: 'excavator', de: 'Bagger', nl: 'graafmachine', id: 'ekskavator' },
  'graafmachine': { en: 'excavator', de: 'Bagger', nl: 'graafmachine', id: 'ekskavator' },
  'ekskavator': { en: 'excavator', de: 'Bagger', nl: 'graafmachine', id: 'ekskavator' },
  'oscilloscope': { en: 'oscilloscope', de: 'Oszilloskop', nl: 'oscilloscoop', id: 'osiloskop' },
  'microscope': { en: 'microscope', de: 'Mikroskop', nl: 'microscoop', id: 'mikroskop' },
  'centrifuge': { en: 'centrifuge', de: 'Zentrifuge', nl: 'centrifuge', id: 'sentrifus' },
  'multimeter': { en: 'multimeter', de: 'Multimeter', nl: 'multimeter', id: 'multimeter' },
  'lathe': { en: 'lathe', de: 'Drehbank', nl: 'draaibank', id: 'mesin bubut' },
  'drone': { en: 'drone', de: 'Drohne', nl: 'drone', id: 'drone' },
  'telescope': { en: 'telescope', de: 'Teleskop', nl: 'telescoop', id: 'teleskop' }
};

export function lookupOfflineDictionary(
  text: string,
  from: LanguageCode,
  to: LanguageCode
): string | null {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) return '';

  for (const item of COMMON_PHRASES) {
    const fromVal = (item as any)[from];
    const toVal = (item as any)[to];
    if (fromVal && toVal && fromVal.toLowerCase() === trimmed) {
      return toVal;
    }
  }

  const cleanTrimmed = trimmed.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
  for (const item of COMMON_PHRASES) {
    const fromVal = (item as any)[from];
    const toVal = (item as any)[to];
    if (fromVal && toVal) {
      const cleanItem = fromVal.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
      if (cleanItem === cleanTrimmed) {
        return toVal;
      }
    }
  }

  const words = cleanTrimmed.split(/\s+/);
  if (words.length >= 1 && words.length <= 3) {
    const translatedWords: string[] = [];
    let matchedAny = false;

    for (const w of words) {
      let foundTranslation = '';
      for (const entry of Object.values(WORD_MAP)) {
        const fromVal = (entry as any)[from];
        const toVal = (entry as any)[to];
        if (fromVal && toVal && fromVal.toLowerCase() === w) {
          foundTranslation = toVal;
          matchedAny = true;
          break;
        }
      }
      translatedWords.push(foundTranslation || w);
    }

    if (matchedAny) {
      return translatedWords.join(' ');
    }
  }

  return null;
}
