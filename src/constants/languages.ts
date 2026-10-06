import type { LanguageCode, LanguageMeta } from '../types';

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    speechCode: 'en-US',
    placeholder: 'Type or paste English text here...',
    samplePhrases: [
      'Good morning! How are you doing today?',
      'Can you please help me find the nearest train station?',
      'Technology makes the world more connected.',
      'Thank you very much for your kind support!'
    ]
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    placeholder: 'Deutschen Text hier eingeben oder einfügen...',
    samplePhrases: [
      'Guten Morgen! Wie geht es dir heute?',
      'Können Sie mir bitte helfen, den nächsten Bahnhof zu finden?',
      'Technologie verbindet die Welt.',
      'Vielen Dank für Ihre freundliche Unterstützung!'
    ]
  },
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    speechCode: 'nl-NL',
    placeholder: 'Typ of plak hier Nederlandse tekst...',
    samplePhrases: [
      'Goedemorgen! Hoe gaat het vandaag met je?',
      'Kunt u mij alstublieft helpen het dichtstbijzijnde treinstation te vinden?',
      'Technologie brengt de wereld dichter bij elkaar.',
      'Hartelijk dank voor je vriendelijke hulp!'
    ]
  },
  id: {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    speechCode: 'id-ID',
    placeholder: 'Ketik atau tempel teks bahasa Indonesia di sini...',
    samplePhrases: [
      'Selamat pagi! Bagaimana kabarmu hari ini?',
      'Bisakah Anda membantu saya menemukan stasiun kereta terdekat?',
      'Teknologi membuat dunia lebih terhubung.',
      'Terima kasih banyak atas bantuan dan kebaikan Anda!'
    ]
  }
};

export const LANGUAGE_KEYS: LanguageCode[] = ['en', 'de', 'nl', 'id'];
