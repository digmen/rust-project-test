import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationES from "./locales/es/translation.json";
import translationZH from "./locales/zh/translation.json";

const resources = {
    en: { translation: translationEN },
    fr: { translation: translationFR },
    ru: { translation: translationRU },
    zh: { translation: translationZH },
    es: { translation: translationES },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        supportedLngs: ['en', 'ru', 'zh', 'fr', 'es'],
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
