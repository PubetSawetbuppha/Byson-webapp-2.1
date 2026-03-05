import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Button } from '../components/ui/Shared';
import { ArrowLeft, Save, Target } from 'lucide-react';

export default function AnimalRequirementPage({ animalId, onBack }) {
  const [animal, setAnimal] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/animals/${animalId}`),
      api.get(`/animals/${animalId}/requirements`)
    ])
      .then(([animalRes, reqRes]) => {
        setAnimal(animalRes.data.data);
        const rows = (reqRes.data.data || []).map(r => ({
          id: r.id,
          nutrientId: r.nutrientId,
          nutrientName: r.nutrient?.name || 'Unknown',
          unit: r.nutrient?.unit || '',
          value: Number(r.required_value ?? 0)
        }));
        setRequirements(rows);
      })
      .catch(() => setError('Failed to load animal requirements'))
      .finally(() => setLoading(false));
  }, [animalId]);

  const onChangeValue = (index, newVal) => {
    const copy = [...requirements];
    copy[index] = { ...copy[index], value: newVal };
    setRequirements(copy);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const req of requirements) {
        await api.put(`/requirements/${req.id}`, {
          required_value: Number(req.value)
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
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
            <Target className="text-[#2E7D32]" size={32} />
            Nutritional Requirements
          </h2>
          <p className="text-gray-500 mt-1">Target nutritional levels for <span className="text-[#2E7D32] font-bold">{animal?.name}</span></p>
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
          {saving ? 'Saving...' : 'Save Requirements'}
        </Button>
      </div>

      <Card className="p-0 overflow-hidden bg-white shadow-sm border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Nutrient Parameter</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Target Requirement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requirements.map((r, idx) => (
              <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-8 py-5">
                  <span className="font-bold text-[#12171D]">{r.nutrientName}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <input
                      type="number"
                      step="any"
                      value={r.value}
                      onChange={e => onChangeValue(idx, e.target.value)}
                      className="w-32 bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2 text-right font-black focus:ring-2 focus:ring-[#2E7D32] focus:bg-white outline-none transition-all"
                    />
                    <span className="text-sm font-bold text-gray-400 w-8">{r.unit}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
          <ArrowLeft size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
