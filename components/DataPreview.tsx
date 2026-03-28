'use client';

import { UploadedData } from '../lib/dataset';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: UploadedData[] | null;
  onLoadSample: () => void;
}

export default function DataPreview({ data, onLoadSample }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center border-2 border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">No data uploaded yet</p>
        <button 
          onClick={onLoadSample}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Load Sample Data
        </button>
      </div>
    );
  }

  const avgRain = (data.reduce((sum, d) => sum + d.rainfall, 0) / (data.length || 1)).toFixed(1);

  const chartData = data.slice(0, 24).map((d, i) => ({
    day: d.date.substring(5), // MM-DD
    rainfall: d.rainfall,
    yield: d.yield || 0,
  }));

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Uploaded Data Preview ({data.length} rows)</h3>
        <span className="text-sm text-emerald-600 font-semibold">Avg Rain: {avgRain} mm</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" angle={-45} height={60} />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="rainfall" stroke="#3B82F6" />
          <Line yAxisId="right" type="monotone" dataKey="yield" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Rainfall</th>
              <th className="px-4 py-2">Temp</th>
              <th className="px-4 py-2">Yield</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 8).map((d, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">{d.date}</td>
                <td className="px-4 py-2 font-medium">{d.rainfall.toFixed(1)}</td>
                <td className="px-4 py-2">{d.temperature?.toFixed(1) || '-'}</td>
                <td className="px-4 py-2">{d.yield?.toFixed(2) || '-'}</td>
              </tr>
            ))}
            {data.length > 8 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500 text-xs">
                  ... {data.length - 8} more rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

