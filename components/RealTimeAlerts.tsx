'use client';

import { useEffect, useState } from 'react';
import { DailySimulation } from '../lib/ml';
import { useLanguage } from '../lib/i18n';

interface RealTimeAlertsProps {
  current: DailySimulation | undefined;
  controls: any;
}

interface Alert {
  id: string;
  type: 'drought' | 'water-stress' | 'excess-rain' | 'poor-soil' | 'optimal' | 'rare-rain' | 'soil-recovery' | 'critical-drought' | 'heavy-rain' | 'soil-degradation' | 'recovery' | 'stable' | 'irrigation' | 'soil-improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function RealTimeAlerts({ current, controls }: RealTimeAlertsProps) {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  // Analyze current conditions and generate alerts
  useEffect(() => {
    if (!current) return;

    const newAlerts: Alert[] = [];
    const { rainfall, cropHealth, statusMessage } = current;
    const soilQuality = controls?.soilQuality || 50;

    // Drought conditions
    if (rainfall < 2 && cropHealth < 30) {
      newAlerts.push({
        id: 'critical-drought',
        type: 'critical-drought',
        priority: 'critical',
        message: t.criticalDrought,
        icon: '🔥',
        color: 'text-red-800',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300'
      });
    } else if (rainfall < 5 && cropHealth < 50) {
      newAlerts.push({
        id: 'drought-alert',
        type: 'drought',
        priority: 'high',
        message: t.droughtAlert,
        icon: '🚨',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300'
      });
    } else if (rainfall < 10 && cropHealth < 70) {
      newAlerts.push({
        id: 'water-stress',
        type: 'water-stress',
        priority: 'medium',
        message: t.waterStressAlert,
        icon: '⚠️',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300'
      });
    }

    // Excess rain conditions
    if (rainfall > 25) {
      newAlerts.push({
        id: 'heavy-rain',
        type: 'heavy-rain',
        priority: 'high',
        message: t.heavyRainWarning,
        icon: '⛈️',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300'
      });
    } else if (rainfall > 15) {
      newAlerts.push({
        id: 'excess-rain',
        type: 'excess-rain',
        priority: 'medium',
        message: t.excessRainAlert,
        icon: '🌧️',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300'
      });
    }

    // Rare rainfall
    if (rainfall < 1) {
      newAlerts.push({
        id: 'rare-rain',
        type: 'rare-rain',
        priority: 'medium',
        message: t.rareRainAlert,
        icon: '🌵',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300'
      });
    }

    // Soil conditions
    if (soilQuality < 30) {
      newAlerts.push({
        id: 'poor-soil',
        type: 'poor-soil',
        priority: 'medium',
        message: t.poorSoilAlert,
        icon: '🪨',
        color: 'text-stone-700',
        bgColor: 'bg-stone-50',
        borderColor: 'border-stone-300'
      });
    } else if (soilQuality > 80) {
      newAlerts.push({
        id: 'soil-improvement',
        type: 'soil-improvement',
        priority: 'low',
        message: t.soilImprovement,
        icon: '🌾',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300'
      });
    }

    // Health-based alerts
    if (cropHealth > 80 && rainfall >= 5 && rainfall <= 15 && soilQuality >= 50) {
      newAlerts.push({
        id: 'optimal',
        type: 'optimal',
        priority: 'low',
        message: t.optimalConditions,
        icon: '✅',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300'
      });
    } else if (cropHealth > 60 && cropHealth <= 80) {
      newAlerts.push({
        id: 'stable',
        type: 'stable',
        priority: 'low',
        message: t.stableConditions,
        icon: '📈',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300'
      });
    }

    // Recovery conditions
    if (statusMessage === 'Healthy growth' && cropHealth > 50) {
      newAlerts.push({
        id: 'recovery',
        type: 'recovery',
        priority: 'low',
        message: t.recoveryPhase,
        icon: '🌿',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300'
      });
    }

    // Irrigation needed
    if (rainfall < 3 && cropHealth < 60) {
      newAlerts.push({
        id: 'irrigation',
        type: 'irrigation',
        priority: 'medium',
        message: t.irrigationNeeded,
        icon: '💧',
        color: 'text-cyan-700',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-300'
      });
    }

    setAlerts(newAlerts);
  }, [current, controls, t]);

  // Show alerts with animation
  useEffect(() => {
    if (alerts.length > 0) {
      // Sort by priority
      const sortedAlerts = [...alerts].sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Show only top 3 alerts
      setVisibleAlerts(sortedAlerts.slice(0, 3));

      // Auto-hide after 8 seconds for non-critical alerts
      const timer = setTimeout(() => {
        setVisibleAlerts(prev => prev.filter(alert => alert.priority === 'critical'));
      }, 8000);

      return () => clearTimeout(timer);
    } else {
      setVisibleAlerts([]);
    }
  }, [alerts]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-2xl border p-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-2 duration-300 ${alert.bgColor} ${alert.borderColor} ${alert.color}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">{alert.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">
                {alert.message}
              </p>
            </div>
            <button
              onClick={() => setVisibleAlerts(prev => prev.filter(a => a.id !== alert.id))}
              className="text-xs opacity-60 hover:opacity-100 flex-shrink-0 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
