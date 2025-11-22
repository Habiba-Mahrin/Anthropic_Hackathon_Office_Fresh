import { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../hooks/useGamification';
import { useVirtualPet } from '../../hooks/useVirtualPet';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type StretchRoutine = Database['public']['Tables']['stretch_routines']['Row'];

interface StretchModalProps {
  stretch: StretchRoutine;
  onClose: () => void;
}

export function StretchModal({ stretch, onClose }: StretchModalProps) {
  const { user } = useAuth();
  const { addPoints } = useGamification();
  const { feedPet } = useVirtualPet();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(stretch.duration_seconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (started && !isPaused && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      handleComplete();
    }
  }, [started, isPaused, timer]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      const points = Math.floor(stretch.duration_seconds / 10) + 5;

      await supabase
        .from('user_stretches')
        .insert({
          user_id: user.id,
          stretch_id: stretch.id,
          points_earned: points,
        });

      await addPoints(points);
      await feedPet(15);

      onClose();
    } catch (error) {
      console.error('Error completing stretch:', error);
    }
  };

  const stepDuration = Math.floor(stretch.duration_seconds / stretch.instructions.length);
  const currentInstruction = stretch.instructions[Math.min(currentStep, stretch.instructions.length - 1)];

  useEffect(() => {
    if (started && !isPaused) {
      const totalElapsed = stretch.duration_seconds - timer;
      const newStep = Math.floor(totalElapsed / stepDuration);
      setCurrentStep(Math.min(newStep, stretch.instructions.length - 1));
    }
  }, [timer, started, isPaused]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{stretch.name}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!started ? (
          <div className="space-y-6">
            <p className="text-gray-600">{stretch.description}</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Instructions:</h4>
              <ol className="space-y-2">
                {stretch.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-gray-700 flex gap-2">
                    <span className="font-medium text-blue-600">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStart}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Start Stretch
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">{timer}s</div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="bg-blue-600 h-full transition-all duration-1000"
                  style={{
                    width: `${((stretch.duration_seconds - timer) / stretch.duration_seconds) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {currentStep + 1}
                </div>
                <p className="text-gray-900 text-lg leading-relaxed">{currentInstruction}</p>
              </div>
            </div>

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
