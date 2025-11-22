import { useState, useEffect } from 'react';
import { Clock, Play, Coffee } from 'lucide-react';
import { BreakModal } from '../break/BreakModal';

interface BreakTimerProps {
  nextBreakTime: Date | null;
  timeUntilBreak: number;
}

export function BreakTimer({ nextBreakTime, timeUntilBreak }: BreakTimerProps) {
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    if (timeUntilBreak <= 0) {
      setShowBreakModal(true);
    }

    const hours = Math.floor(timeUntilBreak / 3600);
    const minutes = Math.floor((timeUntilBreak % 3600) / 60);
    const seconds = timeUntilBreak % 60;

    if (hours > 0) {
      setDisplayTime(`${hours}h ${minutes}m`);
    } else if (minutes > 0) {
      setDisplayTime(`${minutes}m ${seconds}s`);
    } else {
      setDisplayTime(`${seconds}s`);
    }
  }, [timeUntilBreak]);

  const getMotivationalMessage = () => {
    if (timeUntilBreak <= 0) return "Time for a break!";
    if (timeUntilBreak < 300) return "Almost time for a break!";
    if (timeUntilBreak < 600) return "Break coming up soon";
    return "Keep up the great work!";
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Next Break</h2>
              <p className="text-blue-100">{getMotivationalMessage()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowBreakModal(true)}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Start Now
          </button>
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{displayTime}</div>
            {nextBreakTime && (
              <p className="text-blue-100">
                Scheduled for {nextBreakTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
            <Coffee className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Micro Break</p>
            <p className="text-xs text-blue-100">30-60 seconds</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
            <Coffee className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Quick Stretch</p>
            <p className="text-xs text-blue-100">2-3 minutes</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
            <Coffee className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Full Break</p>
            <p className="text-xs text-blue-100">5+ minutes</p>
          </div>
        </div>
      </div>

      {showBreakModal && (
        <BreakModal onClose={() => setShowBreakModal(false)} />
      )}
    </>
  );
}
