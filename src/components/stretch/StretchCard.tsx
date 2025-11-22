import { Clock, Target } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type StretchRoutine = Database['public']['Tables']['stretch_routines']['Row'];

interface StretchCardProps {
  stretch: StretchRoutine;
  onSelect: () => void;
}

export function StretchCard({ stretch, onSelect }: StretchCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onSelect}
      className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{stretch.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(stretch.difficulty)}`}>
          {stretch.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{stretch.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{stretch.duration_seconds}s</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="h-4 w-4" />
          <span className="capitalize">{stretch.target_area.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
}
