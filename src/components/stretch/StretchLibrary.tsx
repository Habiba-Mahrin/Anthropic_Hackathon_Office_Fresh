import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { StretchCard } from './StretchCard';
import { StretchModal } from './StretchModal';

type StretchRoutine = Database['public']['Tables']['stretch_routines']['Row'];

export function StretchLibrary() {
  const [stretches, setStretches] = useState<StretchRoutine[]>([]);
  const [selectedStretch, setSelectedStretch] = useState<StretchRoutine | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadStretches();
  }, []);

  const loadStretches = async () => {
    try {
      const { data, error } = await supabase
        .from('stretch_routines')
        .select('*')
        .order('duration_seconds', { ascending: true });

      if (error) throw error;
      setStretches(data || []);
    } catch (error) {
      console.error('Error loading stretches:', error);
    }
  };

  const filteredStretches = stretches.filter((stretch) => {
    if (filter === 'all') return true;
    return stretch.target_area === filter;
  });

  const areas = ['all', 'neck', 'shoulders', 'back', 'wrists', 'full_body'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Stretch Library</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setFilter(area)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === area
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {area.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStretches.map((stretch) => (
            <StretchCard
              key={stretch.id}
              stretch={stretch}
              onSelect={() => setSelectedStretch(stretch)}
            />
          ))}
        </div>

        {filteredStretches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No stretches found for this category</p>
          </div>
        )}
      </div>

      {selectedStretch && (
        <StretchModal
          stretch={selectedStretch}
          onClose={() => setSelectedStretch(null)}
        />
      )}
    </div>
  );
}
