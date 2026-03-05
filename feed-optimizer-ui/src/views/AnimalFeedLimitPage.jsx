import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Button } from '../components/ui/Shared';
import { ArrowLeft, Save, ShieldAlert } from 'lucide-react';

export default function AnimalFeedLimitPage({ animalId, onBack }) {
  const [animal, setAnimal] = useState(null);
  const [feedLimits, setFeedLimits] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/animals/${animalId}`),
      api.get(`/animals/${animalId}/feed-limits`)
    ])
      .then(([animalRes, flRes]) => {
        setAnimal(animalRes.data.data);
        const rows = (flRes.data.data || []).map(fl => ({
          id: fl.id,
          materialName: fl.material?.name || 'Unknown',
          min_usage: Number(fl.min_usage ?? 0),
          max_usage: Number(fl.max_usage ?? 0),
          unit: '%'
        }));
        setFeedLimits(rows);
      })
      .catch(() => setError('Failed to load animal feed limits'))
      .finally(() => setLoading(false));
  }, [animalId]);

  const onChangeValue = (index, field, newVal) => {
    const copy = [...feedLimits];
    copy[index] = { ...copy[index], [field]: newVal };
    setFeedLimits(copy);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const fl of feedLimits) {
        await api.put(`/feed-limits/${fl.id}`, {
          min_usage: Number(fl.min_usage),
          max_usage: Number(fl.max_usage)
        });
      }
      setDirty(false);
      // alert('Saved successfully');
    } catch (e) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D32] font-bold transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Animal Overview
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-[#12171D] flex items-center gap-3">
            <ShieldAlert className="text-[#C8A951]" size={32} />
            Feed Usage Limits
          </h2>
          <p className="text-gray-500 mt-1">Constraint settings for <span className="text-[#C8A951] font-bold">{animal?.name}</span></p>
        </div>
        <Button 
          disabled={!dirty || saving} 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 h-auto"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saving ? 'Saving...' : 'Save Constraints'}
        </Button>
      </div>

      <Card className="p-0 overflow-hidden bg-white shadow-sm border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Ingredient / Raw Material</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">Min Usage (%)</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">Max Usage (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {feedLimits.map((fl, idx) => (
              <tr key={fl.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-8 py-5">
                  <span className="font-bold text-[#12171D]">{fl.materialName}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      step="any"
                      value={fl.min_usage}
                      onChange={e => onChangeValue(idx, 'min_usage', e.target.value)}
                      className="w-24 bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2 text-center font-bold focus:ring-2 focus:ring-[#2E7D32] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      step="any"
                      value={fl.max_usage}
                      onChange={e => onChangeValue(idx, 'max_usage', e.target.value)}
                      className="w-24 bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2 text-center font-bold focus:ring-2 focus:ring-[#C8A951] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}
    </div>
  );
}
