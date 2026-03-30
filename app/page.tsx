'use client';

import { useEffect, useMemo, useState } from 'react';
import Controls from '../components/Controls';
import CropSimulation from '../components/CropSimulation';
import RainfallChart from '../components/RainfallChart';
import YieldChart from '../components/YieldChart';
import Explainer from '../components/Explainer';
import PredictionForm from '../components/PredictionForm';
import AuthModal from '../components/AuthModal';
import DatasetExample from '../components/DatasetExample';
import RealTimeAlerts from '../components/RealTimeAlerts';
import LanguageToggle from '../components/LanguageToggle';
import { parseExcel, UploadedData } from '../lib/dataset';
import { downloadSampleExcel } from '../lib/excelUtils';
import { LanguageProvider, useLanguage } from '../lib/i18n';
import {
  DailySimulation,
  ImportedDailyData,
  SimulationControls,
  getScenarioPreset,
  runSeasonSimulation,
  trainModelWithImportedData,
} from '../lib/ml';

const DEFAULT_CONTROLS: SimulationControls = {
  rainfallIntensity: 52,
  rainfallVariability: 35,
  seasonLength: 120,
  speed: 'normal',
  soilQuality: 62,
  region: 'Sahel',
};

function statusTone(message: string) {
  if (message === 'Good harvest expected') return 'text-emerald-700 bg-emerald-100 border-emerald-300';
  if (message === 'Healthy growth') return 'text-sky-700 bg-sky-100 border-sky-300';
  if (message === 'Water stress') return 'text-amber-700 bg-amber-100 border-amber-300';
  return 'text-rose-700 bg-rose-100 border-rose-300';
}

function HomeContent() {
  const { t } = useLanguage();
  const [hydrated, setHydrated] = useState(false);
  const [controls, setControls] = useState<SimulationControls>(DEFAULT_CONTROLS);
  const [running, setRunning] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [importedRows, setImportedRows] = useState<UploadedData[] | null>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [importingFileName, setImportingFileName] = useState<string | null>(null);
  const [isImportingExcel, setIsImportingExcel] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [soundOn, setSoundOn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const importedData: ImportedDailyData[] | undefined = useMemo(() => {
    if (!importedRows) return undefined;
    return importedRows.map((row) => ({
      date: row.date,
      rainfall: row.rainfall,
      temperature: row.temperature,
      soil: row.soil,
      yield: row.yield,
    }));
  }, [importedRows]);

  useEffect(() => {
    setHydrated(true);
    // Check if user is already authenticated
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (_error) {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const simulation = useMemo(() => {
    if (!hydrated) return [];
    return runSeasonSimulation(controls, importedData?.slice(0, controls.seasonLength));
  }, [controls, importedData, hydrated]);

  useEffect(() => {
    if (dayIndex > controls.seasonLength - 1) {
      setDayIndex(Math.max(0, controls.seasonLength - 1));
    }
  }, [controls.seasonLength, dayIndex]);

  useEffect(() => {
    if (!running) return;

    const stepMs = controls.speed === 'fast' ? 140 : 400;
    const timer = setInterval(() => {
      setDayIndex((prev) => {
        if (prev >= controls.seasonLength - 1) {
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [running, controls.speed, controls.seasonLength]);

  useEffect(() => {
    if (!soundOn) return;
    const current = simulation[dayIndex];
    if (!current) return;

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = current.statusMessage === 'Drought risk' ? 180 : 480;
    gain.gain.value = 0.02;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.08);

    return () => {
      ctx.close().catch(() => undefined);
    };
  }, [dayIndex, simulation, soundOn]);

  const current: DailySimulation | undefined = simulation[Math.min(dayIndex, simulation.length - 1)];
  const visibleData = simulation.slice(0, Math.min(dayIndex + 1, simulation.length));
  const avgRainfall = visibleData.reduce((sum, row) => sum + row.rainfall, 0) / Math.max(1, visibleData.length);
  const predictedYield = current?.predictedYield ?? 0;
  const cropHealth = current?.cropHealth ?? 0;
  const status = current?.statusMessage ?? 'Healthy growth';

  const onStart = () => {
    if (dayIndex >= controls.seasonLength - 1) {
      setDayIndex(0);
    }
    setRunning(true);
  };

  const onPauseResume = () => {
    setRunning((prev) => !prev);
  };

  const onReset = () => {
    setRunning(false);
    setDayIndex(0);
  };

  const onScenario = (name: 'good' | 'bad' | 'unpredictable') => {
    setControls((prev) => ({ ...prev, ...getScenarioPreset(name) }));
    setFeedback(`${t.scenarioLoaded} ${name}`);
    setRunning(false);
    setDayIndex(0);
  };

  const onImportExcel = async (file: File) => {
    if (!isAuthenticated) {
      setPendingFile(file);
      setIsAuthModalOpen(true);
      setFeedback(t.pleaseSignIn);
      return;
    }

    setIsImportingExcel(true);
    setImportingFileName(file.name);
    setFeedback(`${t.importingFile} ${file.name}...`);
    try {
      const rows = await parseExcel(file);
      setImportedRows(rows);
      setImportedFileName(file.name);
      trainModelWithImportedData(rows);
      setControls((prev) => ({ ...prev, seasonLength: Math.max(60, Math.min(150, rows.length)) }));
      setFeedback(`${t.excelImported} ${rows.length} ${t.rows}. ${t.subtitle}`);
      setRunning(false);
      setDayIndex(0);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : t.importFailed);
    } finally {
      setIsImportingExcel(false);
      setImportingFileName(null);
    }
  };

  const handleAuthSuccess = async (userData: { firstName: string; lastName: string; email: string }) => {
    setAuthUser(userData);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setFeedback(`${t.welcome} ${userData.firstName}! ${t.toUploadExcel}`);

    // If there's a pending file, import it
    if (pendingFile) {
      const fileToImport = pendingFile;
      setPendingFile(null);

      setIsImportingExcel(true);
      setImportingFileName(fileToImport.name);
      setFeedback(`${t.importingFile} ${fileToImport.name}...`);
      try {
        const rows = await parseExcel(fileToImport);
        setImportedRows(rows);
        setImportedFileName(fileToImport.name);
        trainModelWithImportedData(rows);
        setControls((prev) => ({ ...prev, seasonLength: Math.max(60, Math.min(150, rows.length)) }));
        setFeedback(`${t.excelImported} ${rows.length} ${t.rows}. ${t.subtitle}`);
        setRunning(false);
        setDayIndex(0);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : t.importFailed);
      } finally {
        setIsImportingExcel(false);
        setImportingFileName(null);
      }
    }
  };

  const onClearImported = () => {
    setImportedRows(null);
    setImportedFileName(null);
    setFeedback(t.importedCleared);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(120deg,#f2f7ea_0%,#eef7ff_45%,#f8edd8_100%)] px-4 py-6 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{t.title}</h1>
              <p className="mt-1 text-sm text-zinc-700 sm:text-base">
                {t.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <button
                onClick={() => setSoundOn((prev) => !prev)}
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
              >
                {t.soundOn}
              </button>
            </div>
          </div>
          <div className="mt-3 text-sm text-zinc-700">
            <span className="font-semibold">{t.localClimate}</span> Rainy season June-September, dry season October-May.
          </div>
        </header>

        <RealTimeAlerts current={current} controls={controls} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-3">
            <Controls
              controls={controls}
              running={running}
              importedRows={importedRows?.length ?? 0}
              importedFileName={importedFileName}
              isImportingExcel={isImportingExcel}
              importingFileName={importingFileName}
              onControlChange={(patch) => setControls((prev) => ({ ...prev, ...patch }))}
              onScenario={onScenario}
              onStart={onStart}
              onPauseResume={onPauseResume}
              onReset={onReset}
              onImportExcel={onImportExcel}
              onClearImported={onClearImported}
            />
          </div>

          <div className="xl:col-span-5">
            <CropSimulation current={current} currentDay={dayIndex + 1} totalDays={controls.seasonLength} />
            <div className="mt-4">
              <DatasetExample onDownloadSample={downloadSampleExcel} />
            </div>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <RainfallChart
              data={visibleData.map((row) => ({
                day: `D${row.day}`,
                rainfall: row.rainfall,
              }))}
            />

            <YieldChart
              data={visibleData.map((row) => ({
                day: `D${row.day}`,
                predictedYield: row.predictedYield,
                cropHealth: row.cropHealth,
              }))}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3 text-center shadow">
                <p className="text-xs text-zinc-600">Avg rainfall</p>
                <p className="text-xl font-black text-sky-700">{avgRainfall.toFixed(1)}</p>
                <p className="text-xs text-zinc-600">mm/day</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3 text-center shadow">
                <p className="text-xs text-zinc-600">Health index</p>
                <p className="text-xl font-black text-emerald-700">{cropHealth.toFixed(0)}</p>
                <p className="text-xs text-zinc-600">/100</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3 text-center shadow">
                <p className="text-xs text-zinc-600">Current day</p>
                <p className="text-xl font-black text-zinc-800">{Math.min(dayIndex + 1, controls.seasonLength)}</p>
                <p className="text-xs text-zinc-600">of {controls.seasonLength}</p>
              </div>
            </div>

            <PredictionForm predictedYield={predictedYield} category={current?.yieldCategory ?? 'Low'} />

            <div className={`rounded-2xl border p-3 text-sm font-semibold ${statusTone(status)}`}>
              {t.status} {status}
            </div>

            <Explainer current={current} controls={controls} />
          </div>
        </div>

        {feedback ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/90 p-3 text-sm text-zinc-700 shadow">
            {feedback}
          </div>
        ) : null}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingFile(null);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
