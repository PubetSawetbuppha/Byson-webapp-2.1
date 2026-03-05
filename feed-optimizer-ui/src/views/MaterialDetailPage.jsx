import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Button, Input } from '../components/ui/Shared';
import { ArrowLeft, Save, Beaker, Tag, DollarSign } from 'lucide-react';

export default function MaterialDetailPage({ materialId, onBack }) {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [nutrients, setNutrients] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/materials/${materialId}`)
      .then(res => {
        const m = res.data.data;
        setMaterial(m);
        setEditedName(m.name || '');
        setEditedPrice(String(Number(m.price_kg ?? 0)));
        const nv = (m.nutrientValues || []).map(item => ({
          id: item.id,
          nutrientId: (item.nutrient && item.nutrient.id) || item.nutrientId,
          name: (item.nutrient && item.nutrient.name) || item.nutrientName || 'unknown',
          unit: (item.nutrient && item.nutrient.unit) || item.nutrientUnit || '%',
          value: Number(item.value ?? 0)
        }));
        setNutrients(nv);
      })
      .catch(e => setError('Failed to load material details'))
      .finally(() => setLoading(false));
  }, [materialId]);

  const onNutrientChange = (index, newValue) => {
    const copy = [...nutrients];
    copy[index] = { ...copy[index], value: newValue };
    setNutrients(copy);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/materials/${materialId}`, {
        name: editedName,
        price_kg: Number(editedPrice)
      });

      const payload = {
        nutrients: nutrients.map(n => ({ nutrientId: Number(n.nutrientId), value: Number(n.value) }))
      };
      await api.put(`/materials/${materialId}/nutrients`, payload);

      setDirty(false);
      // Refresh
      const fresh = await api.get(`/materials/${materialId}`);
      const m = fresh.data.data;
      setMaterial(m);
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
        className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D32] font-bold transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        Back to Materials
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#12171D] flex items-center gap-3">
            <Beaker className="text-[#2E7D32]" size={32} />
            {material?.name}
          </h2>
          <p className="text-gray-500 mt-1">Configure nutritional profile and market pricing</p>
        </div>
        <Button 
          disabled={!dirty || saving} 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 h-auto text-base"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-4">
            <Tag size={20} className="text-[#C8A951]" />
            Basic Information
          </h3>
          <div className="space-y-4">
            <Input 
              label="Material Name"
              value={editedName}
              onChange={e => { setEditedName(e.target.value); setDirty(true); }}
            />
            <Input 
              label="Market Price (฿/kg)"
              type="number"
              value={editedPrice}
              onChange={e => { setEditedPrice(e.target.value); setDirty(true); }}
              icon={<DollarSign size={16} />}
            />
          </div>
        </Card>

        <Card className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-4">
            <Beaker size={20} className="text-[#2E7D32]" />
            Nutrient Profile
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {nutrients.map((n, idx) => (
              <div key={n.nutrientId} className="flex items-center justify-between gap-4 group">
                <span className="text-sm font-bold text-gray-600 flex-1">{n.name}</span>
                <div className="flex items-center gap-2 w-32">
                  <input
                    type="number"
                    value={n.value}
                    onChange={(e) => onNutrientChange(idx, Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-[#2E7D32] focus:bg-white outline-none transition-all"
                  />
                  <span className="text-xs font-bold text-gray-400 min-w-[24px]">{n.unit}</span>
                </div>
              </div>
            ))}
            {nutrients.length === 0 && (
              <p className="text-center text-gray-400 py-8 italic">No nutrient data available</p>
            )}
          </div>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
          <ArrowLeft size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
