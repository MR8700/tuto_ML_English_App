'use client';

import { ChangeEvent } from 'react';
import { Region, SimulationControls, SimulationSpeed } from '../lib/ml';
import { useLanguage } from '../lib/i18n';

interface ControlsProps {
  controls: SimulationControls;
  running: boolean;
  importedRows: number;
  importedFileName: string | null;
  isImportingExcel: boolean;
  importingFileName: string | null;
  onControlChange: (patch: Partial<SimulationControls>) => void;
  onScenario: (name: 'good' | 'bad' | 'unpredictable') => void;
  onStart: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  onImportExcel: (file: File) => Promise<void>;
  onClearImported: () => void;
}

const regions: Region[] = ['Sahel', 'Centre', 'Hauts-Bassins'];

export default function Controls({
  controls,
  running,
  importedRows,
  importedFileName,
  isImportingExcel,
  importingFileName,
  onControlChange,
  onScenario,
  onStart,
  onPauseResume,
  onReset,
  onImportExcel,
  onClearImported,
}: ControlsProps) {
  const { t } = useLanguage();
  const uploadInputId = 'rainfall-excel-upload';

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await onImportExcel(file);
    event.target.value = '';
  };

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-xl backdrop-blur">
      <h2 className="text-xl font-bold text-zinc-900">{t.seasonControls}</h2>
      <p className="mt-1 text-sm text-zinc-600">Rainfall intensity controls the amount of rain per day.</p>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onScenario('good')} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            {t.goodScenario}
          </button>
          <button onClick={() => onScenario('bad')} className="rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            {t.badScenario}
          </button>
          <button onClick={() => onScenario('unpredictable')} className="rounded-xl bg-sky-700 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-800">
            {t.unpredictableScenario}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          <div className="mb-1 flex justify-between text-zinc-700">
            <span>{t.rainfallIntensity}</span>
            <span>{controls.rainfallIntensity}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={controls.rainfallIntensity}
            onChange={(e) => onControlChange({ rainfallIntensity: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-emerald-600"
          />
        </label>

        <label className="block text-sm">
          <div className="mb-1 flex justify-between text-zinc-700">
            <span>{t.rainfallVariability}</span>
            <span>{controls.rainfallVariability}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={controls.rainfallVariability}
            onChange={(e) => onControlChange({ rainfallVariability: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-amber-600"
          />
        </label>

        <label className="block text-sm">
          <div className="mb-1 flex justify-between text-zinc-700">
            <span>{t.seasonLength} ({t.days})</span>
            <span>{controls.seasonLength}</span>
          </div>
          <input
            type="range"
            min={60}
            max={150}
            value={controls.seasonLength}
            onChange={(e) => onControlChange({ seasonLength: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-sky-600"
          />
        </label>

        <label className="block text-sm">
          <div className="mb-1 flex justify-between text-zinc-700">
            <span>{t.soilQuality}</span>
            <span>{controls.soilQuality}</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            value={controls.soilQuality}
            onChange={(e) => onControlChange({ soilQuality: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-lime-600"
          />
        </label>

        <label className="block text-sm">
          <div className="mb-1 flex justify-between text-zinc-700">
            <span>{t.region}</span>
          </div>
          <select
            value={controls.region}
            onChange={(e) => onControlChange({ region: e.target.value as Region })}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <div className="mb-1 flex justify-between text-zinc-700">
            <span>{t.speed}</span>
          </div>
          <select
            value={controls.speed}
            onChange={(e) => onControlChange({ speed: e.target.value as SimulationSpeed })}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2"
          >
            <option value="normal">{t.normal}</option>
            <option value="fast">{t.fast}</option>
          </select>
        </label>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <label htmlFor={uploadInputId} className="text-sm font-semibold text-zinc-700">
            {t.importExcel} (.xlsx)
          </label>
          <input
            id={uploadInputId}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUpload}
            disabled={isImportingExcel}
            className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-700 file:px-3 file:py-1.5 file:text-white file:hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {isImportingExcel ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" aria-hidden="true" />
              <span>{importingFileName ? `${t.importing} ${importingFileName}...` : `${t.importing} Excel file...`}</span>
            </div>
          ) : null}
          {importedRows > 0 ? (
            <div className="mt-2 space-y-1 text-xs text-zinc-700">
              <div className="flex items-center justify-between">
                <span>{importedRows} {t.rows} {t.imported}</span>
                <button onClick={onClearImported} className="font-semibold text-red-700 hover:underline">
                  {t.clearImported}
                </button>
              </div>
              <div className="truncate text-zinc-500">
                {importedFileName ? `File: ${importedFileName}` : 'File imported'}
              </div>
            </div>
          ) : (
            <div className="mt-2 text-xs text-zinc-500">
              No imported file currently in use.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-3">
          <button onClick={onStart} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            {t.start}
          </button>
          <button onClick={onPauseResume} className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-900">
            {running ? t.pause : t.resume}
          </button>
          <button onClick={onReset} className="rounded-xl bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-800">
            {t.reset}
          </button>
        </div>
      </div>
    </section>
  );
}
