import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

type Gamification = Database['public']['Tables']['gamification']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'] & {
  badge: Database['public']['Tables']['badges']['Row'];
};

export function useGamification() {
  const { user } = useAuth();
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGamification(null);
      setBadges([]);
      setLoading(false);
      return;
    }

    loadGamification();
    loadBadges();
  }, [user]);

  const loadGamification = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gamification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setGamification(data);
    } catch (error) {
      console.error('Error loading gamification:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data as UserBadge[]);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const addPoints = async (points: number) => {
    if (!user || !gamification) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = gamification.last_activity_date;

    let newStreak = gamification.current_streak;
    if (lastActivityDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivityDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const newTotalPoints = gamification.total_points + points;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;
    const longestStreak = Math.max(gamification.longest_streak, newStreak);

    try {
      const { error } = await supabase
        .from('gamification')
        .update({
          total_points: newTotalPoints,
          current_streak: newStreak,
          longest_streak: longestStreak,
          level: newLevel,
          last_activity_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await loadGamification();
      await checkAndAwardBadges(newTotalPoints, newStreak, newLevel);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const checkAndAwardBadges = async (points: number, streak: number, level: number) => {
    if (!user) return;

    try {
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*');

      const { data: userBadgeIds } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      const earnedBadgeIds = new Set(userBadgeIds?.map(b => b.badge_id) || []);

      const { data: breakCount } = await supabase
        .from('break_sessions')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      const { data: stretchCount } = await supabase
        .from('user_stretches')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      for (const badge of allBadges || []) {
        if (earnedBadgeIds.has(badge.id)) continue;

        let shouldAward = false;

        switch (badge.requirement_type) {
          case 'total_points':
            shouldAward = points >= badge.requirement_value;
            break;
          case 'streak_days':
            shouldAward = streak >= badge.requirement_value;
            break;
          case 'level':
            shouldAward = level >= badge.requirement_value;
            break;
          case 'breaks_completed':
            shouldAward = (breakCount?.length || 0) >= badge.requirement_value;
            break;
          case 'stretches_completed':
            shouldAward = (stretchCount?.length || 0) >= badge.requirement_value;
            break;
        }

        if (shouldAward) {
          await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id,
            });
        }
      }

      await loadBadges();
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  return {
    gamification,
    badges,
    loading,
    addPoints,
    refresh: loadGamification,
  };
}
