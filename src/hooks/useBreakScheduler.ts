import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from './useProfile';

export function useBreakScheduler() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null);
  const [timeUntilBreak, setTimeUntilBreak] = useState<number>(0);

  useEffect(() => {
    if (!user || !profile) return;

    calculateNextBreak();
    const interval = setInterval(() => {
      calculateNextBreak();
    }, 1000);

    return () => clearInterval(interval);
  }, [user, profile]);

  const calculateNextBreak = async () => {
    if (!user || !profile) return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = profile.work_hours_start.split(':').map(Number);
    const [endHour, endMin] = profile.work_hours_end.split(':').map(Number);
    const workStart = startHour * 60 + startMin;
    const workEnd = endHour * 60 + endMin;

    if (currentTime < workStart || currentTime >= workEnd) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(startHour, startMin, 0, 0);
      setNextBreakTime(tomorrow);
      setTimeUntilBreak(Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
      return;
    }

    try {
      const { data: lastBreak } = await supabase
        .from('break_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let nextBreak: Date;

      if (lastBreak && lastBreak.completed_at) {
        const lastBreakTime = new Date(lastBreak.completed_at);
        nextBreak = new Date(lastBreakTime.getTime() + profile.break_frequency * 60 * 1000);
      } else {
        nextBreak = new Date(now.getTime() + profile.break_frequency * 60 * 1000);
      }

      const nextBreakMinutes = nextBreak.getHours() * 60 + nextBreak.getMinutes();
      if (nextBreakMinutes >= workEnd) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(startHour, startMin, 0, 0);
        setNextBreakTime(tomorrow);
      } else {
        setNextBreakTime(nextBreak);
      }

      setTimeUntilBreak(Math.max(0, Math.floor((nextBreak.getTime() - now.getTime()) / 1000)));
    } catch (error) {
      console.error('Error calculating next break:', error);
    }
  };

  const scheduleBreak = async () => {
    if (!user) return;

    const now = new Date();
    try {
      const { error } = await supabase
        .from('break_sessions')
        .insert({
          user_id: user.id,
          scheduled_at: now.toISOString(),
          type: 'micro',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error scheduling break:', error);
    }
  };

  const completeBreak = async (breakId: string, durationSeconds: number) => {
    try {
      const { error } = await supabase
        .from('break_sessions')
        .update({
          completed_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq('id', breakId);

      if (error) throw error;
      await calculateNextBreak();
    } catch (error) {
      console.error('Error completing break:', error);
    }
  };

  const skipBreak = async (breakId: string) => {
    try {
      const { error } = await supabase
        .from('break_sessions')
        .update({
          skipped: true,
        })
        .eq('id', breakId);

      if (error) throw error;
      await calculateNextBreak();
    } catch (error) {
      console.error('Error skipping break:', error);
    }
  };

  return {
    nextBreakTime,
    timeUntilBreak,
    scheduleBreak,
    completeBreak,
    skipBreak,
    refresh: calculateNextBreak,
  };
}
