'use client';

import { useLanguage } from '../lib/i18n';
import { DailySimulation } from '../lib/ml';

interface ExplainerProps {
  current?: DailySimulation;
  controls?: {
    rainfallIntensity: number;
    rainfallVariability: number;
    soilQuality: number;
  };
}

export default function Explainer({ current, controls }: ExplainerProps) {
  const { t } = useLanguage();

  if (!current || !controls) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-xl">
        <h3 className="text-lg font-bold text-zinc-900">{t.whatIsHappening}</h3>
        <div className="mt-3 space-y-2 text-sm text-zinc-700">
          <p>{t.rainySeason}</p>
          <p>{t.drySeason}</p>
          <p>{t.irregularRainfall}</p>
        </div>
      </section>
    );
  }

  const explanations = [];

  // Explication basée sur la pluie actuelle
  if (current.rainfall < 2) {
    explanations.push(t.lowRainfall);
  } else if (current.rainfall > 15) {
    explanations.push(t.heavyRainfall);
  } else if (current.rainfall >= 4 && current.rainfall <= 10) {
    explanations.push(t.optimalRainfall);
  }

  // Explication basée sur la santé des cultures
  if (current.cropHealth < 30) {
    explanations.push(t.criticalHealth);
  } else if (current.cropHealth < 50) {
    explanations.push(t.decliningHealth);
  } else if (current.cropHealth > 70) {
    explanations.push(t.goodHealth);
  }

  // Explication basée sur le sol
  if (current.soilQuality < 40) {
    explanations.push(t.poorSoil);
  } else if (current.soilQuality > 70) {
    explanations.push(t.goodSoil);
  }

  // Explication basée sur le stade de croissance
  if (current.stage === 'seed') {
    explanations.push(t.seedStage);
  } else if (current.stage === 'growing') {
    explanations.push(t.growingStage);
  } else if (current.stage === 'mature') {
    explanations.push(t.matureStage);
  }

  // Si pas d'explications spécifiques, utiliser le texte par défaut
  if (explanations.length === 0) {
    explanations.push(t.rainySeason);
    explanations.push(t.drySeason);
    explanations.push(t.irregularRainfall);
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-xl">
      <h3 className="text-lg font-bold text-zinc-900">{t.whatIsHappening}</h3>
      <div className="mt-3 space-y-2 text-sm text-zinc-700">
        {explanations.map((explanation, index) => (
          <p key={index}>{explanation}</p>
        ))}
      </div>
    </section>
  );
}
