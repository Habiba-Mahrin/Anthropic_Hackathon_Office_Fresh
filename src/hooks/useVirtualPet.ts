import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

type VirtualPet = Database['public']['Tables']['virtual_pet']['Row'];

export function useVirtualPet() {
  const { user } = useAuth();
  const [pet, setPet] = useState<VirtualPet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPet(null);
      setLoading(false);
      return;
    }

    loadPet();
  }, [user]);

  const loadPet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('virtual_pet')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setPet(data);
    } catch (error) {
      console.error('Error loading pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const feedPet = async (experienceGain: number = 10) => {
    if (!user || !pet) return;

    const newExperience = pet.experience + experienceGain;
    const newLevel = Math.floor(newExperience / 50) + 1;
    const newHappiness = Math.min(100, pet.happiness + 5);
    const newHealth = Math.min(100, pet.health + 3);

    try {
      const { error } = await supabase
        .from('virtual_pet')
        .update({
          experience: newExperience,
          level: newLevel,
          happiness: newHappiness,
          health: newHealth,
          last_fed: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await loadPet();
    } catch (error) {
      console.error('Error feeding pet:', error);
    }
  };

  const updatePetName = async (name: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('virtual_pet')
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await loadPet();
    } catch (error) {
      console.error('Error updating pet name:', error);
    }
  };

  return {
    pet,
    loading,
    feedPet,
    updatePetName,
    refresh: loadPet,
  };
}
