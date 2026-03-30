'use client';

import { useState } from 'react';
import { useLanguage } from '../lib/i18n';

export const SAMPLE_DATASET = [
  { date: '2023-06-01', rainfall: 42.5, temperature: 28, soil: 65, yield: 720 },
  { date: '2023-06-02', rainfall: 0, temperature: 31, soil: 63, yield: 715 },
  { date: '2023-06-03', rainfall: 55.2, temperature: 27, soil: 70, yield: 735 },
  { date: '2023-06-04', rainfall: 18.3, temperature: 29, soil: 68, yield: 725 },
  { date: '2023-06-05', rainfall: 0, temperature: 32, soil: 62, yield: 710 },
  { date: '2023-06-06', rainfall: 38.1, temperature: 28, soil: 66, yield: 720 },
  { date: '2023-06-07', rainfall: 52.4, temperature: 26, soil: 72, yield: 740 },
  { date: '2023-06-08', rainfall: 0, temperature: 30, soil: 60, yield: 705 },
  { date: '2023-06-09', rainfall: 45.8, temperature: 28, soil: 68, yield: 730 },
  { date: '2023-06-10', rainfall: 62.1, temperature: 25, soil: 75, yield: 755 },
];

interface DatasetExampleProps {
  onDownloadSample: () => void;
}

export default function DatasetExample({ onDownloadSample }: DatasetExampleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-left w-full"
          >
            <div className="flex-1">
              <h3 className="text-sm font-bold text-zinc-900">{t.sampleDataset}</h3>
              <p className="mt-1 text-xs text-zinc-600">
                {t.sampleDescription}
              </p>
            </div>
            <div className="text-lg text-zinc-400 flex-shrink-0">
              {isExpanded ? '−' : '+'}
            </div>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-blue-200 bg-blue-100">
                  <th className="px-2 py-2 text-left font-semibold text-blue-900">Date</th>
                  <th className="px-2 py-2 text-left font-semibold text-blue-900">Rainfall (mm)</th>
                  <th className="px-2 py-2 text-left font-semibold text-blue-900">Temp (°C)</th>
                  <th className="px-2 py-2 text-left font-semibold text-blue-900">Soil Quality</th>
                  <th className="px-2 py-2 text-left font-semibold text-blue-900">Yield (kg/ha)</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_DATASET.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="px-2 py-2 text-zinc-700">{row.date}</td>
                    <td className="px-2 py-2 text-zinc-700">{row.rainfall}</td>
                    <td className="px-2 py-2 text-zinc-700">{row.temperature}</td>
                    <td className="px-2 py-2 text-zinc-700">{row.soil}</td>
                    <td className="px-2 py-2 font-semibold text-emerald-700">{row.yield}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-white/80 border border-zinc-200 p-3 text-xs text-zinc-600 space-y-2">
            <p>
              <span className="font-semibold text-zinc-700">{t.formatRequired}</span>
            </p>
            <p>
              <span className="font-semibold text-zinc-700">{t.formatNote}</span>
            </p>
          </div>

          <button
            onClick={onDownloadSample}
            className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-sky-600 hover:to-cyan-600 shadow-md"
          >
            ⬇ {t.downloadSample}
          </button>
        </div>
      )}
    </div>
  );
}
