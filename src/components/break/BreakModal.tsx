import { useState, useEffect } from 'react';
import { X, Play, Pause, SkipForward, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../hooks/useGamification';
import { useVirtualPet } from '../../hooks/useVirtualPet';
import { useBreakScheduler } from '../../hooks/useBreakScheduler';
import { supabase } from '../../lib/supabase';

interface BreakModalProps {
  onClose: () => void;
}

export function BreakModal({ onClose }: BreakModalProps) {
  const { user } = useAuth();
  const { addPoints } = useGamification();
  const { feedPet } = useVirtualPet();
  const { scheduleBreak } = useBreakScheduler();
  const [breakStarted, setBreakStarted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [breakId, setBreakId] = useState<string | null>(null);

  useEffect(() => {
    if (breakStarted && !isPaused && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      handleComplete();
    }
  }, [breakStarted, isPaused, timer]);

  const handleStart = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('break_sessions')
        .insert({
          user_id: user.id,
          scheduled_at: new Date().toISOString(),
          type: 'micro',
        })
        .select()
        .single();

      if (error) throw error;
      setBreakId(data.id);
      setBreakStarted(true);
    } catch (error) {
      console.error('Error starting break:', error);
    }
  };

  const handleComplete = async () => {
    if (!breakId || !user) return;

    const duration = 60 - timer;

    try {
      await supabase
        .from('break_sessions')
        .update({
          completed_at: new Date().toISOString(),
          duration_seconds: duration,
        })
        .eq('id', breakId);

      const points = Math.max(5, Math.floor(duration / 10));
      await addPoints(points);
      await feedPet(10);

      onClose();
    } catch (error) {
      console.error('Error completing break:', error);
    }
  };

  const handleSkip = async () => {
    if (breakId) {
      await supabase
        .from('break_sessions')
        .update({ skipped: true })
        .eq('id', breakId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Take a Break</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!breakStarted ? (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for a quick break?</h3>
            <p className="text-gray-600 mb-8">
              Take 60 seconds to rest your eyes, stretch, and recharge
            </p>
            <div className="space-y-3">
              <button
                onClick={handleStart}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Break
              </button>
              <button
                onClick={handleSkip}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Skip for Now
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-7xl font-bold text-blue-600 mb-6">
              {timer}s
            </div>
            <p className="text-gray-600 mb-8">
              {timer > 45 && "Close your eyes and take deep breaths"}
              {timer > 30 && timer <= 45 && "Roll your shoulders back"}
              {timer > 15 && timer <= 30 && "Stretch your arms above your head"}
              {timer <= 15 && "Almost done! You're doing great"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
