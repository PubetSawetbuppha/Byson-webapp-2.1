import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Button } from '../components/ui/Shared';
import { ArrowLeft, Target, ShieldAlert, Dog, ChevronRight } from 'lucide-react';

export default function AnimalDetailPage({ animalId, onBack, onSelectMode }) {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/animals/${animalId}`)
      .then(res => setAnimal(res.data.data))
      .catch(() => setError('Failed to load animal details'))
      .finally(() => setLoading(false));
  }, [animalId]);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D32] font-bold transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Animals
      </button>

      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-[#2E7D32] rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg shadow-[#2E7D32]/20">
          <Dog size={40} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#12171D]">{animal?.name}</h2>
          <p className="text-gray-500 font-medium">Select a configuration category to update specifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <button 
          onClick={() => onSelectMode('requirements')}
          className="group text-left"
        >
          <Card className="h-full p-8 border-2 border-transparent hover:border-[#2E7D32] transition-all hover:shadow-xl">
            <div className="w-14 h-14 bg-[#E8F5E9] rounded-2xl flex items-center justify-center text-[#2E7D32] mb-6 group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-black text-[#12171D] mb-2">Nutritional Requirements</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Define the specific target levels for protein, fat, minerals, and other vital nutrients for this species.
            </p>
            <div className="flex items-center gap-2 text-[#2E7D32] font-bold">
              Edit Requirements <ChevronRight size={18} />
            </div>
          </Card>
        </button>

        <button 
          onClick={() => onSelectMode('limits')}
          className="group text-left"
        >
          <Card className="h-full p-8 border-2 border-transparent hover:border-[#C8A951] transition-all hover:shadow-xl">
            <div className="w-14 h-14 bg-[#FFF9C4] rounded-2xl flex items-center justify-center text-[#C8A951] mb-6 group-hover:bg-[#C8A951] group-hover:text-white transition-colors">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-xl font-black text-[#12171D] mb-2">Feed Usage Limits</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Set minimum and maximum constraints for individual ingredients to ensure digestive safety and palate.
            </p>
            <div className="flex items-center gap-2 text-[#C8A951] font-bold">
              Edit Feed Limits <ChevronRight size={18} />
            </div>
          </Card>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold">
          {error}
        </div>
      )}
    </div>
  );
}
