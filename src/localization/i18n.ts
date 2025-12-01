import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { store } from '../redux/store'; // Import the Redux store to access persisted language state

// Import translation files for supported languages
import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';
import gu from './gu.json';
import mr from './mr.json';
import te from './te.json';
import or from './or.json';

// Define resources for i18n, mapping language codes to their translation files
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pa: { translation: pa },
  gu: { translation: gu },
  mr: { translation: mr },
  te: { translation: te },
  or: { translation: or },
};

// Retrieve the currently persisted language from the Redux store.
// This ensures that the app remembers the user's last selected language across sessions.
const persistedLanguage = store.getState().language.current;

// Determine the initial language for i18n.
// If a language is persisted, use it; otherwise, default to English ('en').
let initialLanguage = persistedLanguage || 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', // Specify i18n JSON format compatibility
  resources, // Provide the translation resources
  lng: initialLanguage, // Set the initial language based on persistence or default
  fallbackLng: 'en', // Fallback language if a translation is missing
  interpolation: {
    escapeValue: false, // React already escapes by default, so no need for i18n to escape
  },
});

export default i18n;
