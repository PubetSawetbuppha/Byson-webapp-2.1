import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { useLanguage } from '../components/LanguageContext';
import { Button, Card, Input } from '../components/ui/Shared';
import { 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Scale,
  Search,
  Check,
  BarChart2,
  DollarSign,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const GROUP_ORDER = ['carb', 'protein', 'mineral'];

function sortAndGroup(materials) {
  const grouped = {};
  GROUP_ORDER.forEach(g => (grouped[g] = []));
  materials.forEach(m => {
    const key = (m.materialType?.name || '').toLowerCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });
  GROUP_ORDER.forEach(g => grouped[g].sort((a, b) => ('' + a.name).localeCompare(b.name)));
  return GROUP_ORDER.flatMap(g => grouped[g]);
}

const COLORS = ['#2E7D32', '#C8A951', '#12171D', '#388E3C', '#D32F2F', '#1B5E20'];

export default function AnalyzePage() {
  const { t } = useLanguage();
  const [animals, setAnimals] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [totalWeight, setTotalWeight] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/animals').then(r => setAnimals(r.data.data || r.data || [])).catch(() => setAnimals([]));
    api.get('/materials').then(r => setMaterials(r.data.data || r.data || [])).catch(() => setMaterials([]));
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.materialType?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  const selectedIds = useMemo(() => new Set(rows.map(r => r.id)), [rows]);

  const toggleMaterial = (mat) => {
    if (!selectedAnimal) {
      setMessage('Choose an animal first');
      return;
    }
    setMessage(null);

    if (selectedIds.has(mat.id)) {
      setRows(prev => prev.filter(r => r.id !== mat.id));
    } else {
      const feedLimitData = (mat.feedLimits || []).find(f => f.animalId === Number(selectedAnimal));
      const newRow = {
        id: mat.id,
        name: mat.name,
        price_kg: mat?.price_kg ?? mat?.pricePerKg ?? 0,
        kg: 0,
        minLimit: feedLimitData?.min_usage ?? null,
        maxLimit: feedLimitData?.max_usage ?? null,
        _group: (mat.materialType?.name || '').toLowerCase()
      };
      
      setRows(prev => {
        const next = [...prev, newRow];
        return next.sort((a, b) => {
          const ai = GROUP_ORDER.indexOf(a._group);
          const bi = GROUP_ORDER.indexOf(b._group);
          if (ai !== bi) return ai - bi;
          return a.name.localeCompare(b.name);
        });
      });
    }
  };

  const onRowKgChange = (idx, val) => {
    const copy = [...rows];
    copy[idx] = { ...copy[idx], kg: Number(val) };
    setRows(copy);
  };

  const runAnalyze = async () => {
    setMessage(null);
    if (!selectedAnimal) {
      setMessage('Please select an animal before analyzing.');
      return;
    }

    const kgTotal = rows.reduce((sum, r) => sum + (Number(r.kg) || 0), 0);
    const expected = Number(totalWeight);

    if (Number.isNaN(expected)) {
      setMessage('Total Weight is not a valid number.');
      return;
    }

    // Strict weight check from user's logic
    if (Math.abs(kgTotal - expected) > 0.01) {
      setMessage(`Input weights (${kgTotal.toFixed(2)} kg) do not match Total Weight (${expected.toFixed(2)} kg)`);
      return;
    }

    const payloadMaterials = rows.filter(r => r.id && r.kg).map(r => ({ id: Number(r.id), kg: Number(r.kg) }));
    if (payloadMaterials.length === 0) {
      setMessage('Add at least one material with weight before analyzing.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/analyze', {
        animalId: Number(selectedAnimal),
        totalWeight: expected,
        materials: payloadMaterials
      });
      const data = res.data.data || res.data;
      setResult(data);
    } catch (e) {
      console.error('analyze error', e);
      setMessage('Analyze failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  const costTotal = rows.reduce((s, x) => s + ((Number(x.kg) || 0) * (Number(x.price_kg) || 0)), 0);
  const kgTotal = rows.reduce((sum, r) => sum + (Number(r.kg) || 0), 0);
  const costPerKg = totalWeight > 0 ? costTotal / totalWeight : 0;
  
  const nutrientSummary = result?.nutrientSummary || result?.totals?.nutrients;

  // Calculate KPI values
  const kpiData = useMemo(() => {
    if (!nutrientSummary) return null;
    
    // Find specific nutrients
    const findNutrient = (keywords) => {
      const entry = Object.entries(nutrientSummary).find(([name]) => 
        keywords.some(keyword => name.toLowerCase().includes(keyword.toLowerCase()))
      );
      return entry ? entry[1] : null;
    };

    const protein = findNutrient(['protein', 'โปรตีน']);
    const fat = findNutrient(['fat', 'ไขมัน']);
    const fiber = findNutrient(['fibre', 'ใยอาหาร']);

    return {
      protein: protein ? {
        achieved: Number(protein.achieved) || 0,
        required: Number(protein.required) || 0,
        unit: protein.unit || '%'
      } : null,
      fat: fat ? {
        achieved: Number(fat.achieved) || 0,
        required: Number(fat.required) || 0,
        unit: fat.unit || '%'
      } : null,
      fiber: fiber ? {
        achieved: Number(fiber.achieved) || 0,
        required: Number(fiber.required) || 0,
        unit: fiber.unit || '%'
      } : null
    };
  }, [nutrientSummary]);

  // Cost data sorted by descending total cost for horizontal bar chart
  const costChartData = useMemo(() => {
    const data = rows
      .filter(r => r.id && r.kg > 0)
      .map(r => {
        const percentage = totalWeight > 0 ? ((Number(r.kg) || 0) / Number(totalWeight)) * 100 : 0;
        return {
          name: r.name?.split('(')[0].trim(),
          totalCost: (Number(r.kg) || 0) * (Number(r.price_kg) || 0),
          percentage,
          pricePerKg: Number(r.price_kg) || 0,
          kg: Number(r.kg) || 0
        };
      })
      .sort((a, b) => b.totalCost - a.totalCost); // Descending order
    return data;
  }, [rows, totalWeight]);

  // Nutrient deviation data for horizontal deviation bar chart
  const nutrientDeviationData = useMemo(() => {
    if (!nutrientSummary) return [];
    
    const deviations = Object.entries(nutrientSummary).map(([name, obj]) => {
      const required = Number(obj.required) || 0;
      const achieved = Number(obj.achieved) || 0;
      const deviation = required !== 0 ? ((achieved - required) / required) * 100 : 0;
      const absDeviation = Math.abs(deviation);
      
      return {
        name,
        deviation,
        absDeviation,
        required,
        achieved,
        unit: obj.unit
      };
    });

    // Sort by absolute deviation and take top 5
    return deviations
      .sort((a, b) => b.absDeviation - a.absDeviation)
      .slice(0, 5);
  }, [nutrientSummary]);

  // Get color based on deviation
  const getDeviationColor = (absDeviation) => {
    if (absDeviation <= 3) return '#2E7D32'; // Green
    if (absDeviation <= 8) return '#FF9800'; // Orange
    return '#D32F2F'; // Red
  };

  const getDeviationStatus = (absDeviation) => {
    if (absDeviation <= 3) return 'Balanced';
    if (absDeviation <= 8) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Control Panel - At Top */}
      <Card className="border-none bg-white shadow-sm overflow-hidden p-0">
        <div className="bg-[#F8FAFC] border-b border-gray-100 p-6">
          <div className="flex flex-wrap items-end gap-6 mb-6">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-sm font-bold text-gray-700 mb-2">1. Select Animal</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2E7D32] outline-none transition-all font-medium"
                value={selectedAnimal ?? ''} 
                onChange={e => {
                  setSelectedAnimal(e.target.value ? Number(e.target.value) : null);
                  setMessage(null);
                }}
              >
                <option value="">Select target animal...</option>
                {animals.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div className="w-40">
              <Input 
                label="2. Expected Weight (kg)" 
                type="number" 
                value={totalWeight} 
                onChange={e => setTotalWeight(e.target.value)} 
              />
            </div>

            <Button 
              className="flex items-center gap-2 px-8" 
              onClick={runAnalyze} 
              disabled={loading || !selectedAnimal || rows.length === 0}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">3. Pick Ingredients to Analyze</label>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search ingredients..."
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32] outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
              {filteredMaterials.map(mat => {
                const isSelected = selectedIds.has(mat.id);
                return (
                  <button
                    key={mat.id}
                    onClick={() => toggleMaterial(mat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      isSelected 
                        ? 'bg-[#2E7D32] border-[#2E7D32] text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {mat.name}
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {mat.materialType?.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="m-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* KPI Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Cost */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#2E7D32]/10 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-[#2E7D32]" />
            </div>
            <div className="text-xs text-gray-500 font-medium">Total Cost</div>
          </div>
          <div className="text-2xl font-bold text-[#2E7D32]">฿{costTotal.toFixed(2)}</div>
        </Card>

        {/* Cost per kg */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#C8A951]/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-[#C8A951]" />
            </div>
            <div className="text-xs text-gray-500 font-medium">Cost per kg</div>
          </div>
          <div className="text-2xl font-bold text-[#C8A951]">฿{costPerKg.toFixed(2)}/kg</div>
        </Card>

        {/* Crude Protein */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>
            <div className="text-xs text-gray-500 font-medium">Crude Protein</div>
          </div>
          {kpiData?.protein ? (
            <>
              <div className={`text-2xl font-bold ${kpiData.protein.achieved >= kpiData.protein.required ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {kpiData.protein.achieved.toFixed(1)}{kpiData.protein.unit}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${kpiData.protein.achieved >= kpiData.protein.required ? 'bg-[#2E7D32]' : 'bg-red-600'}`}></span>
                <span className="text-xs text-gray-400">Target: {kpiData.protein.required.toFixed(1)}{kpiData.protein.unit}</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${kpiData.protein.achieved >= kpiData.protein.required ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {kpiData.protein.achieved >= kpiData.protein.required ? '✓ Met' : '✗ Below'}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400 italic">Run analysis</div>
          )}
        </Card>

        {/* Crude Fat */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-purple-600" />
            </div>
            <div className="text-xs text-gray-500 font-medium">Crude Fat</div>
          </div>
          {kpiData?.fat ? (
            <>
              <div className={`text-2xl font-bold ${kpiData.fat.achieved >= kpiData.fat.required ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {kpiData.fat.achieved.toFixed(1)}{kpiData.fat.unit}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${kpiData.fat.achieved >= kpiData.fat.required ? 'bg-[#2E7D32]' : 'bg-red-600'}`}></span>
                <span className="text-xs text-gray-400">Target: {kpiData.fat.required.toFixed(1)}{kpiData.fat.unit}</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${kpiData.fat.achieved >= kpiData.fat.required ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {kpiData.fat.achieved >= kpiData.fat.required ? '✓ Met' : '✗ Below'}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400 italic">Run analysis</div>
          )}
        </Card>

        {/* Crude Fiber */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-orange-600" />
            </div>
            <div className="text-xs text-gray-500 font-medium">Crude Fibre</div>
          </div>
          {kpiData?.fiber ? (
            <>
              <div className={`text-2xl font-bold ${kpiData.fiber.achieved >= kpiData.fiber.required ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {kpiData.fiber.achieved.toFixed(1)}{kpiData.fiber.unit}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${kpiData.fiber.achieved >= kpiData.fiber.required ? 'bg-[#2E7D32]' : 'bg-red-600'}`}></span>
                <span className="text-xs text-gray-400">Target: {kpiData.fiber.required.toFixed(1)}{kpiData.fiber.unit}</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${kpiData.fiber.achieved >= kpiData.fiber.required ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {kpiData.fiber.achieved >= kpiData.fiber.required ? '✓ Met' : '✗ Below'}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400 italic">Run analysis</div>
          )}
        </Card>
      </div>

      {/* Charts Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart - Cost Distribution (sorted by price) */}
        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <DollarSign size={20} className="text-[#2E7D32]" />
            Ingredient Cost Distribution
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costChartData.length ? costChartData : []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value, name, props) => {
                    if (name === 'totalCost') {
                      return [
                        <>
                          <div>Total Cost: ฿{Number(value).toFixed(2)}</div>
                          <div className="text-xs text-gray-500 mt-1">Price/kg: ฿{props.payload.pricePerKg.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">Weight: {props.payload.kg.toFixed(2)} kg</div>
                          <div className="text-xs text-gray-500">Percentage: {props.payload.percentage.toFixed(2)}%</div>
                        </>,
                        ''
                      ];
                    }
                    return [value, name];
                  }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="totalCost" radius={[0, 4, 4, 0]} barSize={30}>
                  {costChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {costChartData.length === 0 && (
            <div className="text-center text-xs text-gray-400 mt-4 italic">
              Add ingredients and define weights to see cost distribution
            </div>
          )}
        </Card>

        {/* Right Chart - Nutrient Adequacy (Deviation) */}
        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Scale size={20} className="text-[#C8A951]" />
            Nutrient Adequacy
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nutrientDeviationData.length ? nutrientDeviationData : []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  label={{ value: 'Deviation (%)', position: 'bottom', fontSize: 12, fill: '#64748B' }}
                  domain={[-20, 20]}
                />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value, name, props) => {
                    return [
                      <>
                        <div>Deviation: {Number(value).toFixed(2)}%</div>
                        <div className="text-xs text-gray-500 mt-1">Required: {props.payload.required.toFixed(2)} {props.payload.unit}</div>
                        <div className="text-xs text-gray-500">Achieved: {props.payload.achieved.toFixed(2)} {props.payload.unit}</div>
                        <div className={`text-xs font-bold mt-1`} style={{ color: getDeviationColor(props.payload.absDeviation) }}>
                          {getDeviationStatus(props.payload.absDeviation)}
                        </div>
                      </>,
                      ''
                    ];
                  }}
                  labelStyle={{ display: 'none' }}
                />
                <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={2} />
                <Bar dataKey="deviation" radius={[0, 4, 4, 0]} barSize={30}>
                  {nutrientDeviationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getDeviationColor(entry.absDeviation)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {nutrientDeviationData.length === 0 && (
            <div className="text-center text-xs text-gray-400 mt-4 italic">
              Run analysis to see nutrient adequacy
            </div>
          )}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2E7D32]"></div>
              <span>Balanced (≤3%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF9800]"></div>
              <span>Warning (3-8%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D32F2F]"></div>
              <span>Critical (&gt;8%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Ingredient Table - Full Width */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Manual Formula Input</h3>
          <span className={`text-sm font-bold ${Math.abs(kgTotal - totalWeight) < 0.01 ? 'text-[#2E7D32]' : 'text-red-500'}`}>
            Current Total: {kgTotal.toFixed(2)} / {totalWeight} kg ({((kgTotal/totalWeight)*100).toFixed(1)}%)
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-gray-500 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Material</th>
                <th className="px-4 py-4 text-center">Price (฿/kg)</th>
                <th className="px-4 py-4 text-center">MinLimit (%)</th>
                <th className="px-4 py-4 text-center">MaxLimit (%)</th>
                <th className="px-4 py-4 text-center">Weight (kg)</th>
                <th className="px-4 py-4 text-center">% of Mix</th>
                <th className="px-4 py-4 text-center">Cost (฿)</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400 italic">
                    Pick ingredients from the selector above to build your formula.
                  </td>
                </tr>
              ) : rows.map((r, idx) => {
                const cost = (Number(r.price_kg) || 0) * (Number(r.kg) || 0);
                const convertedPercent = totalWeight > 0 ? ((Number(r.kg) || 0) / Number(totalWeight)) * 100 : 0;
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="font-bold text-gray-800">{r.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{r._group}</div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500 font-medium">
                      ฿{Number(r.price_kg).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-gray-500 font-medium">
                      {r.minLimit !== null ? `${r.minLimit}%` : '-'}
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-gray-500 font-medium">
                      {r.maxLimit !== null ? `${r.maxLimit}%` : '∞'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input 
                        className="w-24 bg-[#F8FAFC] border border-transparent hover:border-gray-200 rounded px-2 py-1.5 text-center focus:bg-white focus:ring-1 focus:ring-[#2E7D32] outline-none font-bold text-[#12171D]" 
                        type="number" 
                        value={r.kg} 
                        onChange={(e) => onRowKgChange(idx, e.target.value)} 
                      />
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-[#C8A951]">
                      {convertedPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-[#2E7D32]">
                      ฿{cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => setRows(prev => prev.filter(row => row.id !== r.id))}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#F8FAFC]/50 font-black">
              <tr>
                <td className="px-6 py-4 text-gray-400 text-xs uppercase">Totals</td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 text-center text-gray-700">{kgTotal.toFixed(2)} kg</td>
                <td className={`px-4 py-4 text-center ${Math.abs(kgTotal - totalWeight) < 0.01 ? 'text-[#2E7D32]' : 'text-red-500'}`}>
                  {totalWeight > 0 ? ((kgTotal / totalWeight) * 100).toFixed(2) : '0.00'}%
                </td>
                <td className="px-4 py-4 text-center text-[#2E7D32]">฿{costTotal.toFixed(2)}</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Nutritional Achievement Table - Bottom */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Nutritional Achievement</h3>
        <Card className="p-0 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Nutrient</th>
                  <th className="px-4 py-4 text-right">Target</th>
                  <th className="px-4 py-4 text-right">Actual</th>
                  <th className="px-4 py-4 text-right">Difference</th>
                  <th className="px-4 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {nutrientSummary ? Object.entries(nutrientSummary).map(([name, obj]) => {
                  const diff = Number(obj.achieved) - Number(obj.required);
                  const positive = diff >= 0;
                  return (
                    <tr key={name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{name}</div>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-500">
                        {Number(obj.required).toFixed(2)} {obj.unit}
                      </td>
                      <td className={`px-4 py-4 text-right font-black ${positive ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                        {Number(obj.achieved).toFixed(2)} {obj.unit}
                      </td>
                      <td className={`px-4 py-4 text-right font-bold ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {positive ? '+' : ''}{diff.toFixed(2)} {obj.unit}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {positive ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                            <CheckCircle2 size={12} /> Met
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">
                            <AlertCircle size={12} /> Below
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">
                      No results analyzed yet.<br/>Define weights and run analysis.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
