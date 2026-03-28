'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RainfallPoint {
  day: string;
  rainfall: number;
}

interface RainfallChartProps {
  data: RainfallPoint[];
}

export default function RainfallChart({ data }: RainfallChartProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-xl">
      <h3 className="text-lg font-bold text-zinc-900">Rainfall trend (mm/day)</h3>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="rainfall" stroke="#0f766e" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
