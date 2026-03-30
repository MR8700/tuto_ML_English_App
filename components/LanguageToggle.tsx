'use client';

import { useLanguage, Language } from '../lib/i18n';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 transition-colors"
      title={language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
    >
      <span className="text-lg">
        {language === 'en' ? '🇫🇷' : '🇬🇧'}
      </span>
      <span className="hidden sm:inline">
        {language === 'en' ? 'FR' : 'EN'}
      </span>
    </button>
  );
}


