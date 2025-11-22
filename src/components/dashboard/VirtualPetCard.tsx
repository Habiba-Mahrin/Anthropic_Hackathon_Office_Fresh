import { Heart, Sparkles, TrendingUp } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type VirtualPet = Database['public']['Tables']['virtual_pet']['Row'];

interface VirtualPetCardProps {
  pet: VirtualPet | null;
}

export function VirtualPetCard({ pet }: VirtualPetCardProps) {
  if (!pet) return null;

  const getPetEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      cat: '🐱',
      dog: '🐶',
      bunny: '🐰',
      bird: '🐦',
      default: '🐱',
    };
    return emojis[type] || emojis.default;
  };

  const experienceToNextLevel = ((pet.level) * 50) - pet.experience;
  const levelProgress = ((pet.experience % 50) / 50) * 100;

  return (
    <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Your Companion</h3>

      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm mb-4">
        <div className="text-center mb-4">
          <div className="text-8xl mb-2">{getPetEmoji(pet.pet_type)}</div>
          <h4 className="text-2xl font-bold">{pet.name}</h4>
          <p className="text-pink-100">Level {pet.level}</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                Happiness
              </span>
              <span>{pet.happiness}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${pet.happiness}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Health
              </span>
              <span>{pet.health}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${pet.health}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Experience
              </span>
              <span>{experienceToNextLevel} XP to level up</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-sm text-pink-100 text-center">
          Complete breaks and stretches to keep {pet.name} happy and healthy!
        </p>
      </div>
    </div>
  );
}
