// src/services/formula.service.js
const solver = require('javascript-lp-solver');
const formulaRepo = require('../repositories/formulaRepo');
const prisma = require('../prisma/client');

/**
 * Sanitize a string into a safe LP key (no spaces/special chars).
 */
function sanitizeKey(s) {
  if (!s) return '';
  return String(s).replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Normalize a nutrient name to a canonical form used internally:
 * trim + lowercase.
 */
function normalizeName(s) {
  if (!s) return '';
  return String(s).trim().toLowerCase();
}

/**
 * Small debug toggle. Set to true to print model/vars before solving.
 */
const DEBUG = false;

/**
 * Optimize formula using javascript-lp-solver
 * Accepts: { animalId, materialIds, totalWeight }
 *
 * This version:
 *  - normalizes nutrient names so repo naming mismatches don't drop coefficients
 *  - enforces strict equality for EVERY nutrient (including energy/kcal)
 *  - slack variables are present but commented out (so you can re-enable easily)
 */
exports.optimize = async ({ animalId, materialIds, totalWeight }) => {
  if (!animalId) throw new Error('animalId required');
  if (!Array.isArray(materialIds) || materialIds.length === 0) throw new Error('materialIds required');
  totalWeight = Number(totalWeight) || 100;

  // --- 1) Load data from repo ---
  const materialsRaw = await formulaRepo.getMaterialsByIds(materialIds);
  const requirementsRaw = await formulaRepo.getAnimalRequirements(animalId);
  const limitsRaw = await formulaRepo.getFeedLimitsForAnimal(animalId);

  if (!materialsRaw || materialsRaw.length === 0) {
    throw new Error('No materials found for given IDs');
  }

  // --- 2) Build reqMap keyed by normalized nutrient name ---
  // reqMap[nameNorm] = { required, unit, key, rawName }
  const reqMap = {};
  (requirementsRaw || []).forEach((r) => {
    const nutrientObj = r.nutrient || r.nutrientType || null;
    const rawName = (nutrientObj?.name || r.nutrientName || r.nutrient_type_name || '').toString();
    if (!rawName) return;
    const nameNorm = normalizeName(rawName);
    const unit = (nutrientObj?.display_unit || r.display_unit || '').toString();
    const key = sanitizeKey(nameNorm);
    reqMap[nameNorm] = {
      required: Number(r.required_value ?? r.required ?? 0),
      unit,
      key,
      rawName
    };
  });

  const nutrientNames = Object.keys(reqMap);
  if (nutrientNames.length === 0) {
    throw new Error('No animal nutrient requirements found for this animal');
  }

  // Big penalty for slack variables (if we use soft constraints)
  const BIG_PENALTY = 1e7;

  // --- 3) Build LP model ---
  const model = {
    optimize: 'cost',
    opType: 'min',
    constraints: {
      weight: { equal: totalWeight } // Σ x_i = totalWeight
    },
    variables: {}
  };

  const activeConstraints = [];

  // Create variables for materials
  for (const m of materialsRaw) {
    const varKey = `m_${m.id}`;
    const varObj = {
      cost: Number(m.price_kg ?? 0),
      weight: 1
    };

    // map material nutrient values into the variable only for required nutrients
    (m.nutrientValues || []).forEach((nv) => {
      const nutrientObj = nv.nutrient || nv.nutrientType || null;
      const rawMatName = (nutrientObj?.name || nv.nutrientName || '').toString();
      if (!rawMatName) return;
      const nnameNorm = normalizeName(rawMatName);
      if (!reqMap[nnameNorm]) return; // skip nutrients not required by the animal

      const unit = (nutrientObj?.display_unit || nv.display_unit || '').toString().toLowerCase();
      const key = reqMap[nnameNorm].key;
      const val = Number(nv.value ?? nv.val ?? 0);

      if (unit.includes('kcal')) {
        // energy per kg (kcal/kg) — variable coefficient is kcal/kg so LHS will be kcal
        varObj[key] = val;
      } else {
        // percent: convert to kg of nutrient per kg of material (kg nutrient per kg material)
        varObj[key] = val / 100.0;
      }
    });

    // per-material limits (min/max usage percent -> kg)
    const limitEntry = (limitsRaw || []).find(l => l.materialId === m.id || l.material_id === m.id);
    if (limitEntry) {
      if (limitEntry.max_usage != null) {
        const capKey = `cap_${m.id}`;
        model.constraints[capKey] = { max: (Number(limitEntry.max_usage) / 100) * totalWeight };
        varObj[capKey] = 1;
        activeConstraints.push(`max_usage for ${m.name} = ${limitEntry.max_usage}%`);
      }
      if (limitEntry.min_usage != null && Number(limitEntry.min_usage) > 0) {
        const minKey = `min_${m.id}`;
        model.constraints[minKey] = { min: (Number(limitEntry.min_usage) / 100) * totalWeight };
        varObj[minKey] = 1;
        activeConstraints.push(`min_usage for ${m.name} = ${limitEntry.min_usage}%`);
      }
    }

    model.variables[varKey] = varObj;
  }

  // --- 4) Add nutrient constraints (STRICT equality) ---
  // For each required nutrient, build an equality constraint. Units handled as:
  // - kcal: RHS = required_kcal_per_kg * totalWeight   (LHS will be sum x_i * kcal_i -> kcal)
  // - percent: RHS = (required% / 100) * totalWeight   (LHS will be kg_of_nutrient)
  Object.entries(reqMap).forEach(([nameNorm, meta]) => {
    const key = meta.key;
    const unit = (meta.unit || '').toLowerCase();
    const required = Number(meta.required || 0);

    if (isNaN(required)) return;

    if (unit.includes('kcal')) {
      model.constraints[key] = { min: required * totalWeight };
    } else {
      model.constraints[key] = { min: (required / 100.0) * totalWeight };
    }

    // Slack variables preserved but COMMENTED OUT so you can enable them for soft constraints testing.
  
    const slackKey = `slack_${key}`;
    const slackObj = {
      cost: BIG_PENALTY
    };
    // slack contributes +1 to the nutrient constraint (units match because RHS used kg or kcal)
    slackObj[key] = 1;
    model.variables[slackKey] = slackObj;
    
  });

  if (DEBUG) {
    console.log('--- LP model ---');
    console.log('constraints:', Object.keys(model.constraints));
    console.log('variables sample:', Object.entries(model.variables).slice(0, 6));
  }

  // --- 5) Solve ---
  const results = solver.Solve(model);

  // --- 6) Interpret results ---
  const notes = [];
  if (!results || !('feasible' in results) || !results.feasible) {
    notes.push('Solver reported infeasible or non-optimal solution. With strict equality constraints (no slack), infeasibility is common — consider re-enabling slack variables or relaxing some constraints for feasibility.');
  }

  // Prepare accumulation structures
  const resultMaterials = [];
  // nutrientTotals keyed by normalized name: percent-nutrients stored as kg; energy stored as total kcal
  const nutrientTotals = {};
  Object.keys(reqMap).forEach(n => { nutrientTotals[n] = 0; });

  let totalCost = 0;

  for (const m of materialsRaw) {
    const varKey = `m_${m.id}`;
    const kg = Number(results[varKey] ?? 0);
    const percent = totalWeight > 0 ? (kg / totalWeight) * 100 : 0;
    const cost = kg * Number(m.price_kg ?? 0);

    // compute nutrient contributions for this material
    const nutrientContributions = {};
    (m.nutrientValues || []).forEach((nv) => {
      const nutrientObj = nv.nutrient || nv.nutrientType || null;
      const rawMatName = (nutrientObj?.name || nv.nutrientName || '').toString();
      if (!rawMatName) return;
      const nnameNorm = normalizeName(rawMatName);
      if (!reqMap[nnameNorm]) return;

      const unit = (nutrientObj?.display_unit || nv.display_unit || '').toString().toLowerCase();
      const val = Number(nv.value ?? 0);

      if (unit.includes('kcal')) {
        // total kcal from this material: kg * kcal/kg => kcal
        const energyTotal = kg * val;
        nutrientContributions[reqMap[nnameNorm].rawName || nnameNorm] = Number(energyTotal.toFixed(4));
        nutrientTotals[nnameNorm] += energyTotal;
      } else {
        // kg of nutrient contributed: kg * (val/100)
        const kgNutrient = kg * (val / 100.0);
        nutrientContributions[reqMap[nnameNorm].rawName || nnameNorm] = Number(kgNutrient.toFixed(4));
        nutrientTotals[nnameNorm] += kgNutrient;
      }
    });

    totalCost += cost;

    resultMaterials.push({
      id: m.id,
      name: m.name,
      kg: Number(kg.toFixed(2)),
      percent: Number(percent.toFixed(2)),
      cost: Number(cost.toFixed(2)),
      nutrientContributions
    });
  }

  // --- 7) Build nutrient summary (achieved vs required) ---
  const nutrientSummary = {};
  Object.entries(reqMap).forEach(([nameNorm, meta]) => {
    const unit = (meta.unit || '').toLowerCase();
    if (unit.includes('kcal')) {
      // achieved kcal/kg
      const achieved = totalWeight > 0 ? (nutrientTotals[nameNorm] || 0) / totalWeight : 0;
      nutrientSummary[nameNorm] = {
        achieved: Number(achieved.toFixed(2)),
        required: Number(meta.required),
        unit: meta.unit || 'kcal/kg'
      };
    } else {
      // achieved percent = (kg_of_nutrient / totalWeight) * 100
      const achievedPct = totalWeight > 0 ? ((nutrientTotals[nameNorm] || 0) / totalWeight) * 100 : 0;
      nutrientSummary[nameNorm] = {
        achieved: Number(achievedPct.toFixed(2)),
        required: Number(meta.required),
        unit: meta.unit || '%'
      };
    }
  });

  // detect used slacks from results (if any remained enabled)
  const usedSlacks = [];
  Object.entries(reqMap).forEach(([nameNorm, meta]) => {
    const slackKey = `slack_${meta.key}`;
    const slackVal = Number(results[slackKey] ?? 0);
    if (slackVal > 0) usedSlacks.push({ nutrient: nameNorm, slack: Number(slackVal.toFixed(4)) });
  });
  if (usedSlacks.length) {
    notes.push('Slack variables used (deficiency not fully supplied by ingredients):', usedSlacks);
  }
  if (activeConstraints.length) {
    notes.push('Active per-material usage constraints:', activeConstraints);
  }

  const feasible = Boolean(results && results.feasible && usedSlacks.length === 0);

  // --- 8) Final return (rounded values) ---
  const totals = {
    weight: Number(totalWeight.toFixed(2)),
    cost: Number(totalCost.toFixed(2)),
    nutrients: nutrientSummary
  };

  return {
    materials: resultMaterials,
    totals,
    requirement: {
      totalWeight,
      // return requirement keyed by normalized nutrient name with the numeric required value
      requirements: Object.fromEntries(Object.entries(reqMap).map(([k, v]) => [k, v.required]))
    },
    nutrientSummary,
    feasible,
    notes
  };
};

/* -------------------------------------------------------------
   ANALYZE - updated to use normalized names and consistent units
   ------------------------------------------------------------- */

/// ANALYZE ///
exports.analyze = async (formula) => {
  try {
    const { totalWeight, materials, animalId } = formula;

    // 1. Fetch material data
    const dbMaterials = await prisma.material.findMany({
      where: { id: { in: materials.map((m) => m.id) } },
      include: {
        nutrientValues: { include: { nutrient: true } },
      },
    });

    // 2. Fetch requirements (with nutrient + unit)
    const dbRequirements = await prisma.animalRequirement.findMany({
      where: { animalId },
      include: { nutrient: true },
    });

    // Build requirements map normalized (same logic as optimize)
    const requirements = {};
    dbRequirements.forEach((req) => {
      const rawName = (req.nutrient?.name || '').toString();
      if (!rawName) return;
      const nameNorm = normalizeName(rawName);
      requirements[nameNorm] = {
        required: Number(req.required_value ?? req.required ?? 0),
        unit: req.nutrient?.unit || ''
      };
    });

    // 3. Analyze material usage
    const analyzedMaterials = [];
    let totalCost = 0;
    // totalNutrients keyed by normalized name
    const totalNutrients = {};
    Object.keys(requirements).forEach(n => { totalNutrients[n] = 0; });

    for (const mat of materials) {
      const dbMat = dbMaterials.find((m) => m.id === mat.id);
      if (!dbMat) continue;

      const kgUsed = mat.kg || 0;
      const percent = totalWeight > 0 ? (kgUsed / totalWeight) * 100 : 0;
      const cost = Number(dbMat.price_kg ?? 0) * kgUsed;
      totalCost += cost;

      // nutrient contributions (we store raw contributions: kg for percent nutrients, kcal for energy)
      const contributions = {};
      for (const nv of dbMat.nutrientValues) {
        const rawName = (nv.nutrient?.name || '').toString();
        if (!rawName) continue;
        const nameNorm = normalizeName(rawName);
        if (!(nameNorm in requirements)) continue;

        const unit = (nv.display_unit || nv.nutrient?.unit || '').toString().toLowerCase();
        const nvValue = Number(nv.value ?? nv.val ?? 0);

        if (unit.includes('kcal')) {
          // nvValue is kcal/kg => energy contribution = kgUsed * kcal/kg => kcal
          const energy = kgUsed * nvValue;
          contributions[nameNorm] = energy;
          totalNutrients[nameNorm] = (totalNutrients[nameNorm] || 0) + energy;
        } else {
          // nvValue is percent (e.g., 21) => kg nutrient = kgUsed * (nvValue/100)
          const kgNutrient = kgUsed * (nvValue / 100.0);
          contributions[nameNorm] = kgNutrient;
          totalNutrients[nameNorm] = (totalNutrients[nameNorm] || 0) + kgNutrient;
        }
      }

      analyzedMaterials.push({
        id: dbMat.id,
        name: dbMat.name,
        kg: kgUsed,
        percent,
        cost,
        nutrientContributions: contributions,
      });
    }

    // 4. Build nutrient summary (consistent with optimize)
    const nutrientSummary = {};
    for (const [nameNorm, req] of Object.entries(requirements)) {
      const unit = (req.unit || '').toLowerCase();

      if (unit.includes('kcal')) {
        // achieved kcal/kg = totalKcal / totalWeight
        const achieved = totalWeight > 0 ? (totalNutrients[nameNorm] || 0) / totalWeight : 0;
        nutrientSummary[nameNorm] = {
          achieved: achieved.toFixed(2),
          required: req.required,
          unit: req.unit || 'kcal/kg',
          surplus: (achieved - req.required) > 0 ? (achieved - req.required).toFixed(2) : 0,
          deficiency: (achieved - req.required) < 0 ? (req.required - achieved).toFixed(2) : 0,
        };
      } else {
        // achieved percent = (kg_of_nutrient / totalWeight) * 100
        const achievedPct = totalWeight > 0 ? ((totalNutrients[nameNorm] || 0) / totalWeight) * 100 : 0;
        nutrientSummary[nameNorm] = {
          achieved: achievedPct.toFixed(2),
          required: req.required,
          unit: req.unit || '%',
          surplus: (achievedPct - req.required) > 0 ? (achievedPct - req.required).toFixed(2) : 0,
          deficiency: (achievedPct - req.required) < 0 ? (req.required - achievedPct).toFixed(2) : 0,
        };
      }
    }

    return {
      materials: analyzedMaterials,
      totals: {
        weight: totalWeight,
        cost: totalCost,
        nutrients: nutrientSummary,
      },
      requirement: {
        animalId,
        totalWeight,
        requirements,
      },
      nutrientSummary,
    };
  } catch (err) {
    console.error('analyze service error:', err);
    throw err;
  }
};
