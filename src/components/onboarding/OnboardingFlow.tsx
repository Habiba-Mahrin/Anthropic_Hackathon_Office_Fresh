import { useState } from 'react';
import { Clock, Calendar, Bell, CheckCircle } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { requestNotificationPermission } from '../../utils/notifications';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { updateProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [breakFrequency, setBreakFrequency] = useState(45);

  const handleWorkHoursSubmit = () => {
    setStep(2);
  };

  const handleBreakFrequencySubmit = () => {
    setStep(3);
  };

  const handleNotificationSetup = async () => {
    await requestNotificationPermission();
    setStep(4);
  };

  const handleComplete = async () => {
    await updateProfile({
      work_hours_start: workStart,
      work_hours_end: workEnd,
      break_frequency: breakFrequency,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  } ${s !== 4 ? 'mr-2' : ''}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">Step {step} of 4</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Set Your Work Hours
                </h2>
                <p className="text-gray-600">
                  Help us schedule breaks during your working hours
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleWorkHoursSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Break Frequency
                </h2>
                <p className="text-gray-600">
                  Choose how often you'd like to take breaks
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minutes between breaks
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="15"
                    value={breakFrequency}
                    onChange={(e) => setBreakFrequency(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>30 min</span>
                    <span className="font-semibold text-blue-600">{breakFrequency} min</span>
                    <span>90 min</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Research suggests taking a break every 45-60 minutes optimizes focus and prevents burnout.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBreakFrequencySubmit}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Bell className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enable Notifications
                </h2>
                <p className="text-gray-600">
                  Get timely reminders for your breaks
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Notifications help you stay on track with your wellness routine. You can manage them in your browser settings anytime.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNotificationSetup}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Enable Notifications
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All Set!
                </h2>
                <p className="text-gray-600">
                  You're ready to start your wellness journey
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-2">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Work hours configured</span>
                </div>
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Break schedule set</span>
                </div>
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Notifications enabled</span>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
