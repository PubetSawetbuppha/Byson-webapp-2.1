import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Button } from '../components/ui/Shared';
import { ChevronRight, Dog, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export default function AnimalListPage({ onSelectAnimal }) {
  const { t } = useLanguage();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/animals')
      .then(res => setAnimals(res.data.data || []))
      .catch(() => setError('Failed to load animals'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#12171D]">{t('animals')}</h2>
          <p className="text-gray-500 text-sm">Configure nutritional requirements and feed limits for different species</p>
        </div>
        <Button className="hidden md:flex items-center gap-2">
          <Dog size={18} />
          Add Animal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map(a => (
          <Card key={a.id} className="p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-gray-100 group" onClick={() => onSelectAnimal(a.id)}>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                <Dog size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#12171D] group-hover:text-[#2E7D32] transition-colors">{a.name}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">{a.type || 'Cricket Species'}</p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                <span className="text-sm font-bold text-gray-400">View Specs</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#2E7D32] transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {animals.length === 0 && !error && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Dog size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-400">No animals configured</h3>
          <p className="text-gray-400 text-sm">Add your cricket growth stages to start optimizing feed</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
          <ArrowLeft size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
