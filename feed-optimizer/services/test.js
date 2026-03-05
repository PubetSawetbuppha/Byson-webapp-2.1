// // src/services/formula.service.js
// const solver = require('javascript-lp-solver');
// const formulaRepo = require('../repositories/formulaRepo');
// const prisma = require('../prisma/client');

// /**
//  * Sanitize a string into a safe LP key (no spaces/special chars).
//  */
// function sanitizeKey(s) {
//   if (!s) return '';
//   return String(s).replace(/[^a-zA-Z0-9_]/g, '_');
// }

// /**
//  * Optimize formula using javascript-lp-solver
//  * Accepts: { animalId, materialIds, totalWeight }
//  */
// exports.optimize = async ({ animalId, materialIds, totalWeight }) => {
//   if (!animalId) throw new Error('animalId required');
//   if (!Array.isArray(materialIds) || materialIds.length === 0) throw new Error('materialIds required');
//   totalWeight = Number(totalWeight) || 100;

//   // --- 1) Load data from repo ---
//   const materialsRaw = await formulaRepo.getMaterialsByIds(materialIds);
//   const requirementsRaw = await formulaRepo.getAnimalRequirements(animalId);
//   const limitsRaw = await formulaRepo.getFeedLimitsForAnimal(animalId);

//   if (!materialsRaw || materialsRaw.length === 0) {
//     throw new Error('No materials found for given IDs');
//   }

//   // --- 2) Build request map from requirements (nutrientName -> { required, unit, key }) ---
//   const reqMap = {};
//   (requirementsRaw || []).forEach((r) => {
//     // support a couple of possible shapes depending on repo: r.nutrient, r.nutrientType, r.nutrientTypeName...
//     const nutrientObj = r.nutrient || r.nutrientType || null;
//     const name = nutrientObj?.name || r.nutrientName || r.nutrient_type_name;
//     if (!name) return;
//     const unit = (nutrientObj?.display_unit || r.display_unit || '').toString();
//     const key = sanitizeKey(name);
//     reqMap[name] = {
//       required: Number(r.required_value ?? r.required ?? 0),
//       unit,
//       key
//     };
//   });

//   const nutrientNames = Object.keys(reqMap);
//   if (nutrientNames.length === 0) {
//     throw new Error('No animal nutrient requirements found for this animal');
//   }

//   // Big penalty for slack variables (if we use soft constraints)
//   const BIG_PENALTY = 1e7;

//   // --- 3) Build LP model ---
//   const model = {
//     optimize: 'cost',
//     opType: 'min',
//     constraints: {
//       weight: { equal: totalWeight } // Σ x_i = totalWeight
//     },
//     variables: {}
//   };

//   const activeConstraints = [];

//   // Create variables for materials
//   for (const m of materialsRaw) {
//     const varKey = `m_${m.id}`;
//     const varObj = {
//       cost: Number(m.price_kg ?? 0),
//       weight: 1
//     };

//     // map material nutrient values into the variable only for required nutrients
//     (m.nutrientValues || []).forEach((nv) => {
//       const nutrientObj = nv.nutrient || nv.nutrientType || null;
//       const nname = nutrientObj?.name || nv.nutrientName;
//       if (!nname) return;
//       if (!reqMap[nname]) return; // skip nutrients not required by the animal

//       const unit = (nutrientObj?.display_unit || nv.display_unit || '').toString().toLowerCase();
//       const key = reqMap[nname].key;

//       const val = Number(nv.value ?? nv.val ?? 0);

//       if (unit.includes('kcal')) {
//         // energy per kg
//         varObj[key] = val;
//       } else {
//         // percent: convert to kg of nutrient per kg of material
//         varObj[key] = val / 100.0;
//       }
//     });

//     // per-material limits (min/max usage percent -> kg)
//     const limitEntry = (limitsRaw || []).find(l => l.materialId === m.id || l.material_id === m.id);
//     if (limitEntry) {
//       if (limitEntry.max_usage != null) {
//         const capKey = `cap_${m.id}`;
//         model.constraints[capKey] = { max: (Number(limitEntry.max_usage) / 100) * totalWeight };
//         varObj[capKey] = 1;
//         activeConstraints.push(`max_usage for ${m.name} = ${limitEntry.max_usage}%`);
//       }
//       if (limitEntry.min_usage != null && Number(limitEntry.min_usage) > 0) {
//         const minKey = `min_${m.id}`;
//         model.constraints[minKey] = { min: (Number(limitEntry.min_usage) / 100) * totalWeight };
//         varObj[minKey] = 1;
//         activeConstraints.push(`min_usage for ${m.name} = ${limitEntry.min_usage}%`);
//       }
//     }

//     model.variables[varKey] = varObj;
//   }

//   // --- 4) Add nutrient constraints + slack variables (soft constraints) ---
//   // For each required nutrient, build constraint. Use sanitized key names
//   Object.entries(reqMap).forEach(([nname, meta]) => {
//     const key = meta.key;
//     const unit = (meta.unit || '').toLowerCase();
//     const required = Number(meta.required || 0);

//     if (isNaN(required)) return;

//     if (unit.includes('kcal')) {
//       //energy config
//       model.constraints[key] = { equal: required * totalWeight };
//     } else {
//       //nutrient config
//       model.constraints[key] = { equal: (required / 100.0) * totalWeight };
//     }

//     // Slack var to allow soft constraint: slack_key adds to the LHS to meet the min
//   //   const slackKey = `slack_${key}`;
//   //   const slackObj = {
//   //     cost: BIG_PENALTY
//   //   };
//   //   // slack contributes +1 to the nutrient constraint (units match because RHS used kg or kcal)
//     // slackObj[key] = 1;
//     // model.variables[slackKey] = slackObj;
//   });

//   // --- 5) Solve ---
//   const results = solver.Solve(model);

//   // --- 6) Interpret results ---
//   const notes = [];
//   if (!results || !('feasible' in results) || !results.feasible) {
//     notes.push('Solver reported infeasible or non-optimal solution; slack (soft) variables may have been used.');
//   }

//   // Prepare accumulation structures
//   const resultMaterials = [];
//   const nutrientTotals = {}; // totals in raw units (kg for % nutrients, total kcal for energy)
//   Object.keys(reqMap).forEach(n => { nutrientTotals[n] = 0; });

//   let totalCost = 0;

//   for (const m of materialsRaw) {
//     const varKey = `m_${m.id}`;
//     const kg = Number(results[varKey] ?? 0);
//     const percent = totalWeight > 0 ? (kg / totalWeight) * 100 : 0;
//     const cost = kg * Number(m.price_kg ?? 0);

//     // compute nutrient contributions for this material
//     const nutrientContributions = {};
//     (m.nutrientValues || []).forEach((nv) => {
//       const nutrientObj = nv.nutrient || nv.nutrientType || null;
//       const nname = nutrientObj?.name || nv.nutrientName;
//       if (!nname) return;
//       if (!reqMap[nname]) return;

//       const unit = (nutrientObj?.display_unit || nv.display_unit || '').toString().toLowerCase();
//       const val = Number(nv.value ?? 0);

//       if (unit.includes('kcal')) {
//         // total kcal from this material: kg * kcal/kg
//         const energyTotal = kg * val;
//         nutrientContributions[nname] = Number(energyTotal.toFixed(4));
//         nutrientTotals[nname] += energyTotal;
//       } else {
//         // kg of nutrient contributed: kg * (val/100)
//         const kgNutrient = kg * (val / 100.0);
//         nutrientContributions[nname] = Number(kgNutrient.toFixed(4));
//         nutrientTotals[nname] += kgNutrient;
//       }
//     });

//     totalCost += cost;

//     resultMaterials.push({
//       id: m.id,
//       name: m.name,
//       kg: Number(kg.toFixed(2)),
//       percent: Number(percent.toFixed(2)),
//       cost: Number(cost.toFixed(2)),
//       nutrientContributions
//     });
//   }

//   // --- 7) Build nutrient summary (achieved vs required) ---
//   const nutrientSummary = {};
//   Object.entries(reqMap).forEach(([nname, meta]) => {
//     const unit = (meta.unit || '').toLowerCase();
//     if (unit.includes('kcal')) {
//       // achieved kcal/kg
//       const achieved = totalWeight > 0 ? (nutrientTotals[nname] || 0) / totalWeight : 0;
//       nutrientSummary[nname] = {
//         achieved: Number(achieved.toFixed(2)),
//         required: Number(meta.required),
//         unit: meta.unit || 'kcal/kg'
//       };
//     } else {
//       // achieved percent = (kg_of_nutrient / totalWeight) * 100
//       const achievedPct = totalWeight > 0 ? ((nutrientTotals[nname] || 0) / totalWeight) * 100 : 0;
//       nutrientSummary[nname] = {
//         achieved: Number(achievedPct.toFixed(2)),
//         required: Number(meta.required),
//         unit: meta.unit || '%'
//       };
//     }
//   });

//   // detect used slacks from results
//   const usedSlacks = [];
//   Object.entries(reqMap).forEach(([nname, meta]) => {
//     const slackKey = `slack_${meta.key}`;
//     const slackVal = Number(results[slackKey] ?? 0);
//     if (slackVal > 0) usedSlacks.push({ nutrient: nname, slack: Number(slackVal.toFixed(4)) });
//   });
//   if (usedSlacks.length) {
//     notes.push('Slack variables used (deficiency not fully supplied by ingredients):', usedSlacks);
//   }
//   if (activeConstraints.length) {
//     notes.push('Active per-material usage constraints:', activeConstraints);
//   }

//   const feasible = Boolean(results && results.feasible && usedSlacks.length === 0);

//   // --- 8) Final return (rounded values) ---
//   const totals = {
//     weight: Number(totalWeight.toFixed(2)),
//     cost: Number(totalCost.toFixed(2)),
//     nutrients: nutrientSummary
//   };

//   return {
//     materials: resultMaterials,
//     totals,
//     requirement: {
//       totalWeight,
//       requirements: Object.fromEntries(Object.entries(reqMap).map(([k, v]) => [k, v.required]))
//     },
//     nutrientSummary,
//     feasible,
//     notes
//   };
// };


// // services/formulaServices.js


// /// ANALYZE ///
// exports.analyze = async (formula) => {
//   try {
//     const { totalWeight, materials, animalId } = formula;

//     // 1. Fetch material data
//     const dbMaterials = await prisma.material.findMany({
//       where: { id: { in: materials.map((m) => m.id) } },
//       include: {
//         nutrientValues: { include: { nutrient: true } },
//       },
//     });

//     // 2. Fetch requirements (with nutrient + unit)
//     const dbRequirements = await prisma.animalRequirement.findMany({
//       where: { animalId },
//       include: { nutrient: true },
//     });

//     const requirements = {};
//     dbRequirements.forEach((req) => {
//       const nutrientName = req.nutrient.name.toLowerCase();
//       requirements[nutrientName] = {
//         required: Number(req.required_value),
//         unit: req.nutrient.unit,
//       };
//     });

//     // 3. Analyze material usage
//     const analyzedMaterials = [];
//     let totalCost = 0;
//     const totalNutrients = {};

//     for (const mat of materials) {
//       const dbMat = dbMaterials.find((m) => m.id === mat.id);
//       if (!dbMat) continue;

//       const kgUsed = mat.kg;
//       const percent = (kgUsed / totalWeight) * 100;
//       const cost = Number(dbMat.price_kg) * kgUsed;
//       totalCost += cost;

//       // nutrient contributions
//       const contributions = {};
//       for (const nv of dbMat.nutrientValues) {
//         const nutrientName = nv.nutrient.name.toLowerCase();
//         const weightFraction = kgUsed / totalWeight; // portion of the formula
//         const contribution = weightFraction * Number(nv.value);

//         contributions[nutrientName] = contribution;

//         totalNutrients[nutrientName] =
//           (totalNutrients[nutrientName] || 0) + contribution;
//       }

//       analyzedMaterials.push({
//         id: dbMat.id,
//         name: dbMat.name,
//         kg: kgUsed,
//         percent,
//         cost,
//         nutrientContributions: contributions,
//       });
//     }

//     // 4. Build nutrient summary
//     const nutrientSummary = {};
//     for (const [nutrient, req] of Object.entries(requirements)) {
//       const achieved = (totalNutrients[nutrient] || 0); // already % from contributions
//       nutrientSummary[nutrient] = {
//         achieved: achieved.toFixed(2),   // keep 2 decimals
//         required: req.required,
//         unit: req.unit, // should be "%"
//         surplus: achieved > req.required ? (achieved - req.required).toFixed(2) : 0,
//         deficiency: achieved < req.required ? (req.required - achieved).toFixed(2) : 0,
//       };

//     }

//     return {
//       materials: analyzedMaterials,
//       totals: {
//         weight: totalWeight,
//         cost: totalCost,
//         nutrients: nutrientSummary,
//       },
//       requirement: {
//         animalId,
//         totalWeight,
//         requirements,
//       },
//       nutrientSummary,
//     };
//   } catch (err) {
//     console.error('analyze service error:', err);
//     throw err;
//   }
// };


// OLD VERSION // 
