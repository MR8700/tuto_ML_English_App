'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface YieldPoint {
  day: string;
  predictedYield: number;
  cropHealth: number;
}

interface YieldChartProps {
  data: YieldPoint[];
}

export default function YieldChart({ data }: YieldChartProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-xl">
      <h3 className="text-lg font-bold text-zinc-900">Yield and health trajectory</h3>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar yAxisId="left" dataKey="predictedYield" fill="#15803d" radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cropHealth" stroke="#b45309" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
