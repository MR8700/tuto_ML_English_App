'use client';

import { motion } from 'framer-motion';
import { DailySimulation, stageVisual } from '../lib/ml';
import { useLanguage } from '../lib/i18n';

interface CropSimulationProps {
  current?: DailySimulation;
  currentDay: number;
  totalDays: number;
}

function healthColor(health: number) {
  if (health >= 65) return '#2f9e44';
  if (health >= 40) return '#d4a017';
  return '#9c6644';
}

function stageLabel(stage: string, t: any) {
  if (stage === 'seed') return t.seed;
  if (stage === 'growing') return t.growing;
  if (stage === 'healthy') return t.healthy;
  if (stage === 'mature') return t.mature;
  if (stage === 'dry') return t.dry;
  return t.dead;
}

export default function CropSimulation({ current, currentDay, totalDays }: CropSimulationProps) {
  const { t } = useLanguage();
  const stage = current?.stage ?? 'seed';
  const health = current?.cropHealth ?? 58;
  const visual = stageVisual(stage);
  const scale = 0.55 + (current?.growthProgress ?? 0) / 90;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 p-6 shadow-xl">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.35),transparent_40%)]" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold text-zinc-900">{t.simulationView}</h2>
        <p className="mt-1 text-sm text-zinc-700">{t.seedToMaturity}</p>

        <div className="mt-8 flex min-h-[280px] items-end justify-center">
          <motion.div
            key={stage}
            initial={{ scale: 0.5, opacity: 0.7 }}
            animate={{ scale, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ backgroundColor: healthColor(health), borderColor: visual.color }}
              transition={{ duration: 0.6 }}
              className="relative flex h-40 w-40 items-end justify-center overflow-hidden rounded-full border-4 shadow-lg"
            >
              <motion.div
                animate={{
                  height:
                    stage === 'seed'
                      ? 24
                      : stage === 'growing'
                      ? 70
                      : stage === 'healthy'
                      ? 92
                      : stage === 'mature'
                      ? 100
                      : stage === 'dry'
                      ? 66
                      : 40,
                }}
                transition={{ duration: 0.5 }}
                className="w-2 rounded-full bg-emerald-900"
              />

              {stage !== 'seed' ? (
                <>
                  <motion.div
                    animate={{
                      rotate: stage === 'dry' || stage === 'dead' ? -30 : -18,
                      backgroundColor: stage === 'dry' || stage === 'dead' ? '#a16207' : '#16a34a',
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-16 right-[52%] h-8 w-4 rounded-full"
                  />
                  <motion.div
                    animate={{
                      rotate: stage === 'dry' || stage === 'dead' ? 30 : 18,
                      backgroundColor: stage === 'dry' || stage === 'dead' ? '#a16207' : '#16a34a',
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-16 left-[52%] h-8 w-4 rounded-full"
                  />
                </>
              ) : null}

              {stage === 'mature' ? <div className="absolute bottom-[70%] h-6 w-6 rounded-full bg-amber-300 ring-2 ring-amber-500" /> : null}
            </motion.div>
            <p className="mt-3 text-sm font-semibold text-zinc-800">{stageLabel(stage, t)}</p>
          </motion.div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm text-zinc-700">
            <span>Crop health index</span>
            <span>{health.toFixed(0)} / 100</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-200">
            <motion.div
              className="h-3 rounded-full"
              animate={{ width: `${health}%`, backgroundColor: healthColor(health) }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm text-zinc-700">
            <span>Day {Math.max(currentDay, 1)}</span>
            <span>Day {totalDays}</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-200">
            <motion.div
              className="h-2 rounded-full bg-sky-700"
              animate={{ width: `${(Math.max(currentDay, 1) / totalDays) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
