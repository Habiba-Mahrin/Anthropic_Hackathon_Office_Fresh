import { TrendingUp, Award, Flame, Star } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Gamification = Database['public']['Tables']['gamification']['Row'];

interface StatsPanelProps {
  gamification: Gamification | null;
}

export function StatsPanel({ gamification }: StatsPanelProps) {
  if (!gamification) return null;

  const stats = [
    {
      label: 'Total Points',
      value: gamification.total_points,
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      label: 'Current Streak',
      value: `${gamification.current_streak} days`,
      icon: Flame,
      color: 'bg-orange-500',
    },
    {
      label: 'Level',
      value: gamification.level,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Longest Streak',
      value: `${gamification.longest_streak} days`,
      icon: Award,
      color: 'bg-blue-500',
    },
  ];

  const pointsToNextLevel = ((gamification.level) * 100) - gamification.total_points;
  const levelProgress = ((gamification.total_points % 100) / 100) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Your Progress</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-xl p-4">
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Level Progress</span>
          <span className="text-sm font-medium text-blue-600">{pointsToNextLevel} pts to next level</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
