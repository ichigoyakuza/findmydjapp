// Utility for getting translations outside of React components
import { Language, translations } from '../contexts/LanguageContext';

// Global language handler - will be set by the LanguageProvider
let globalLanguage: Language = 'fr';

export const setGlobalLanguage = (language: Language) => {
  globalLanguage = language;
};

export const getTranslation = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[globalLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to French if key not found
      value = translations.fr;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return the key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

// Convenience function
export const t = getTranslation;