// // Mock API data and logic
// const mockAnimals = [
//   { id: 1, name: 'จิ้งหรีดทองดำ (ช่วงไข่ - 15 วัน)', type: 'Cricket' },
//   { id: 2, name: 'จิ้งหรีดทองดำ (16 - 30 วัน)', type: 'Cricket' },
//   { id: 3, name: 'จิ้งหรีดทองดำ (31 - จับขาย)', type: 'Cricket' },
//   { id: 4, name: 'จิ้งหรีดทองแดง (โตเต็มวัย)', type: 'Cricket' }
// ];

// const mockMaterials = [
//   { 
//     id: 1, 
//     name: 'กากเบียร์แห้ง (Dried Brewer Grain)', 
//     materialType: { name: 'Protein' }, 
//     price_kg: 12.5,
//     feedLimits: [
//       { animalId: 1, max_usage: 20 },
//       { animalId: 2, max_usage: 40 },
//       { animalId: 3, max_usage: 60 }
//     ]
//   },
//   { 
//     id: 2, 
//     name: 'กากรำละเอียด (Rice Bran)', 
//     materialType: { name: 'Carb' }, 
//     price_kg: 8.0,
//     feedLimits: [{ animalId: 1, max_usage: 30 }]
//   },
//   { 
//     id: 3, 
//     name: 'กากถั่วเหลือง (Soybean Meal)', 
//     materialType: { name: 'Protein' }, 
//     price_kg: 22.0,
//     feedLimits: [{ animalId: 1, max_usage: 25 }]
//   },
//   { 
//     id: 4, 
//     name: 'ข้าวโพดบด (Ground Corn)', 
//     materialType: { name: 'Carb' }, 
//     price_kg: 10.5,
//     feedLimits: []
//   },
//   { 
//     id: 5, 
//     name: 'เปลือกหอยป่น (Shell Meal)', 
//     materialType: { name: 'Mineral' }, 
//     price_kg: 5.0,
//     feedLimits: []
//   },
//   { 
//     id: 6, 
//     name: 'วิตามินรวม (Premix)', 
//     materialType: { name: 'Mineral' }, 
//     price_kg: 120.0,
//     feedLimits: [{ animalId: 1, max_usage: 2 }]
//   }
// ];

// export const api = {
//   get: async (path) => {
//     await new Promise(r => setTimeout(r, 500));
//     if (path === '/animals') return { data: { data: mockAnimals } };
//     if (path === '/materials') return { data: { data: mockMaterials } };
    
//     // Animal Detail & Sub-resources
//     const animalMatch = path.match(/\/animals\/(\d+)/);
//     if (animalMatch && !path.includes('requirements') && !path.includes('feed-limits')) {
//       const id = parseInt(animalMatch[1]);
//       const animal = mockAnimals.find(a => a.id === id);
//       return { data: { data: animal || mockAnimals[0] } };
//     }
    
//     if (path.includes('/requirements')) {
//       return { 
//         data: { 
//           data: [
//             { id: 101, nutrientId: 1, nutrient: { name: 'Protein', unit: '%' }, required_value: 20 },
//             { id: 102, nutrientId: 2, nutrient: { name: 'Fat', unit: '%' }, required_value: 5 },
//             { id: 103, nutrientId: 3, nutrient: { name: 'Fiber', unit: '%' }, required_value: 8 },
//             { id: 104, nutrientId: 4, nutrient: { name: 'Calcium', unit: '%' }, required_value: 1.2 }
//           ] 
//         } 
//       };
//     }

//     if (path.includes('/feed-limits')) {
//       return {
//         data: {
//           data: mockMaterials.map((m, idx) => ({
//             id: 200 + idx,
//             material: { name: m.name },
//             min_usage: 0,
//             max_usage: m.feedLimits?.[0]?.max_usage || 100
//           }))
//         }
//       };
//     }

//     // Material Detail & Sub-resources
//     const materialMatch = path.match(/\/materials\/(\d+)/);
//     if (materialMatch) {
//       const id = parseInt(materialMatch[1]);
//       const material = mockMaterials.find(m => m.id === id) || mockMaterials[0];
//       return { 
//         data: { 
//           data: {
//             ...material,
//             nutrientValues: [
//               { id: 301, nutrient: { id: 1, name: 'Protein', unit: '%' }, value: 18 },
//               { id: 302, nutrient: { id: 2, name: 'Fat', unit: '%' }, value: 4 },
//               { id: 303, nutrient: { id: 3, name: 'Fiber', unit: '%' }, value: 12 }
//             ]
//           } 
//         } 
//       };
//     }

//     return { data: { data: [] } };
//   },
//   post: async (path, payload) => {
//     await new Promise(r => setTimeout(r, 1500));
//     if (path === '/optimize') {
//       const { materialIds, totalWeight } = payload;
//       const count = materialIds.length;
//       const weightPer = totalWeight / count;
//       const percentPer = 100 / count;

//       return {
//         data: {
//           data: {
//             materials: materialIds.map(id => {
//               const m = mockMaterials.find(mat => mat.id === id);
//               return {
//                 id,
//                 name: m?.name || 'Unknown',
//                 kg: weightPer,
//                 percent: percentPer
//               };
//             }),
//             nutrientSummary: {
//               'Protein': { required: 20, achieved: 21.4, unit: '%' },
//               'Fat': { required: 5, achieved: 4.8, unit: '%' },
//               'Fiber': { required: 8, achieved: 7.2, unit: '%' },
//               'Calcium': { required: 1.2, achieved: 1.5, unit: '%' },
//               'Metabolic Energy': { required: 2800, achieved: 2850, unit: 'kcal/kg' }
//             }
//           }
//         }
//       };
//     }
//     if (path === '/analyze') {
//       const { materials: payloadMaterials, totalWeight } = payload;
//       return {
//         data: {
//           data: {
//             nutrientSummary: {
//               'Protein': { required: 20, achieved: 19.8, unit: '%' },
//               'Fat': { required: 5, achieved: 5.2, unit: '%' },
//               'Fiber': { required: 8, achieved: 8.5, unit: '%' },
//               'Calcium': { required: 1.2, achieved: 1.1, unit: '%' },
//               'Metabolic Energy': { required: 2800, achieved: 2790, unit: 'kcal/kg' }
//             }
//           }
//         }
//       };
//     }
//     return { data: { data: {} } };
//   },
//   put: async (path, payload) => {
//     await new Promise(r => setTimeout(r, 1000));
//     return { data: { success: true } };
//   }
// };

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
});