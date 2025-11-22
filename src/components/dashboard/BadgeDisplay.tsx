import { Award, Lock } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type UserBadge = Database['public']['Tables']['user_badges']['Row'] & {
  badge: Database['public']['Tables']['badges']['Row'];
};

interface BadgeDisplayProps {
  badges: UserBadge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-6 w-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900">Badges</h3>
        <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {badges.length} earned
        </span>
      </div>

      {badges.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((userBadge) => (
            <div
              key={userBadge.id}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 text-center"
            >
              <div className="text-4xl mb-2">{userBadge.badge.icon === 'Award' ? '🏆' : '⭐'}</div>
              <h4 className="font-bold text-gray-900 mb-1">{userBadge.badge.name}</h4>
              <p className="text-xs text-gray-600">{userBadge.badge.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Earned {new Date(userBadge.earned_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No badges yet</p>
          <p className="text-sm text-gray-500 mt-2">Complete breaks and stretches to earn your first badge!</p>
        </div>
      )}
    </div>
  );
}
