'use client';

import { useLanguage } from '../lib/i18n';

interface PredictionFormProps {
  predictedYield: number;
  category: string;
}

export default function PredictionForm({ predictedYield, category }: PredictionFormProps) {
  const { t } = useLanguage();
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-xl">
      <h3 className="text-lg font-bold text-zinc-900">{t.aiYieldPrediction}</h3>
      <p className="mt-2 text-3xl font-black text-emerald-700">{predictedYield.toFixed(2)} {t.tonsPerHectare}</p>
      <p className="text-sm text-zinc-700">{t.category}: {category}</p>
    </section>
  );
}
