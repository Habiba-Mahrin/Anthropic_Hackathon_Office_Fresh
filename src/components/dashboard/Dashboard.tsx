import { useState, useEffect } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useGamification } from '../../hooks/useGamification';
import { useVirtualPet } from '../../hooks/useVirtualPet';
import { useBreakScheduler } from '../../hooks/useBreakScheduler';
import { StatsPanel } from './StatsPanel';
import { BreakTimer } from './BreakTimer';
import { VirtualPetCard } from './VirtualPetCard';
import { StretchLibrary } from '../stretch/StretchLibrary';
import { ChatCompanion } from '../chat/ChatCompanion';
import { BadgeDisplay } from './BadgeDisplay';
import { SettingsModal } from './SettingsModal';

export function Dashboard() {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { gamification, badges } = useGamification();
  const { pet } = useVirtualPet();
  const { nextBreakTime, timeUntilBreak } = useBreakScheduler();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stretch' | 'chat'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Wellness Hub</h1>
                <p className="text-xs text-gray-500">Your health companion</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                <p className="text-xs text-gray-500">Level {gamification?.level || 1}</p>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('stretch')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'stretch'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Stretch Library
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chat Companion
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BreakTimer nextBreakTime={nextBreakTime} timeUntilBreak={timeUntilBreak} />
              <StatsPanel gamification={gamification} />
              <BadgeDisplay badges={badges} />
            </div>

            <div className="space-y-6">
              <VirtualPetCard pet={pet} />
            </div>
          </div>
        )}

        {activeTab === 'stretch' && <StretchLibrary />}

        {activeTab === 'chat' && <ChatCompanion />}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
