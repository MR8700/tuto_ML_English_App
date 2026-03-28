'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  
  useEffect(() => {
    const saved = localStorage.getItem('appLanguage') as 'fr' | 'en' | null;
    if (saved) setLanguage(saved);
  }, []);

  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: '🌾 Rainfall Impact on Crop Growth - Burkina Faso Sahel', fr: '🌾 Impact des Précipitations sur la Croissance des Cultures - Sahel Burkina Faso' },
      subtitle: { en: 'Interactive simulation showing how rainfall variability affects sorghum growth and yield in Burkina Faso\'s Sahel region.', fr: 'Simulation interactive montrant comment la variabilité des précipitations affecte la croissance et le rendement du sorgho dans le Sahel burkinabè.' },
      controlsTitle: { en: '🌧️ Crop Growth Controls', fr: '🌧️ Contrôles de Croissance des Cultures' },
      rainIntensity: { en: 'Rain Intensity', fr: 'Intensité des Pluies' },
      rainIntensityDesc: { en: 'Burkina baseline', fr: 'Base Burkina' },
      variability: { en: 'Variability', fr: 'Variabilité' },
      variabilityDesc: { en: 'Irregular rain', fr: 'Pluies irrégulières' },
      seasonStart: { en: 'Season Start', fr: 'Début Saison' },
      seasonStartDesc: { en: 'Rainy offset', fr: 'Décalage pluvieux' },
      simSpeed: { en: 'Sim Speed', fr: 'Vitesse Sim' },
      simSpeedDesc: { en: 'Animation pace', fr: 'Rythme animation' },
      drySpell: { en: 'Dry Spell Sens.', fr: 'Sens. Sécheresse' },
      drySpellDesc: { en: 'Drought trigger', fr: 'Déclencheur sécheresse' },
      totalDays: { en: 'Total Days', fr: 'Jours Total' },
      healthIndex: { en: 'Health Index', fr: 'Indice Santé' },
      day: { en: 'Day', fr: 'Jour' },
      reset: { en: 'Reset', fr: 'Reset' },
      play: { en: 'Play', fr: 'Jouer' },
      pause: { en: 'Pause', fr: 'Pause' },
      goodSeason: { en: 'Good Season', fr: 'Bonne Saison' },
      goodDesc: { en: '(Stable rain)', fr: '(Pluie stable)' },
      badSeason: { en: 'Bad Season', fr: 'Mauvaise Saison' },
      badDesc: { en: '(Drought)', fr: '(Sécheresse)' },
      unpredictable: { en: 'Unpredictable', fr: 'Imprévisible' },
      unpredDesc: { en: '(High variability)', fr: '(Forte variabilité)' },
      explainerTitle: { en: 'Burkina Faso Sahel Simulation', fr: 'Simulation Sahel Burkina Faso' },
      healthy: { en: 'Healthy', fr: 'Sain' },
      stress: { en: 'Stress', fr: 'Stress' },
      drought: { en: 'Drought', fr: 'Sécheresse' },
      dead: { en: 'Dead', fr: 'Mort' },
      sahelClimate: { en: 'Sahel Climate', fr: 'Climat Sahel' },
      avgRainfall: { en: 'Avg Daily Rainfall', fr: 'Pluie Moy. Quotid.' },
      predictedYield: { en: 'Predicted Yield', fr: 'Rendement Prévu' },
      currentHealth: { en: 'Current Health', fr: 'Santé Actuelle' },
      footer1: { en: 'Academic simulation tool • Realistic Sahel climate model • Next.js + Framer Motion + Custom ML', fr: 'Outil de simulation académique • Modèle climatique Sahel réaliste • Next.js + Framer Motion + ML personnalisé' },
      footer2: { en: 'Irregular rainfall reduces yields by up to 60% in Burkina Faso', fr: 'Les pluies irrégulières réduisent les rendements jusqu\'à 60% au Burkina Faso' },
    };
    return translations[key]?.[language] || key;
  };

  const updateLanguage = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}


