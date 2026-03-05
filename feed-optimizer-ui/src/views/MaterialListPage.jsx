import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Button } from '../components/ui/Shared';
import { ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export default function MaterialListPage({ onSelectMaterial }) {
  const { t } = useLanguage();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/materials')
      .then(res => setMaterials(res.data.data || []))
      .catch(() => setError('Failed to load materials'))
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
          <h2 className="text-2xl font-bold text-[#12171D]">{t('rawMaterials')}</h2>
          <p className="text-gray-500 text-sm">Manage your available ingredients and their costs</p>
        </div>
        <Button className="hidden md:flex items-center gap-2">
          <Package size={18} />
          Add Material
        </Button>
      </div>

      <Card className="p-0 overflow-hidden bg-white shadow-sm border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Material Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Price (฿/kg)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {materials.map(m => (
                <tr key={m.id} className="hover:bg-[#F8FAFC] transition-colors group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onSelectMaterial(m.id)}
                      className="font-bold text-[#12171D] hover:text-[#2E7D32] transition-colors text-left"
                    >
                      {m.name}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 rounded text-gray-500">
                      {m.materialType?.name || 'Ingredient'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    ฿{Number(m.price_kg ?? m.pricePerKg ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onSelectMaterial(m.id)}
                      className="inline-flex items-center gap-1 text-[#2E7D32] font-bold text-sm hover:underline"
                    >
                      Edit Details
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {materials.length === 0 && !error && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-400">No materials found</h3>
          <p className="text-gray-400 text-sm">Start by adding your first raw material ingredient</p>
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
