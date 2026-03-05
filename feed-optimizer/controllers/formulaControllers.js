// src/controllers/formula.controller.js
const formulaService = require('../services/formulaServices');

exports.optimize = async (req, res) => {
  try {
    const { animalId, materialIds, totalWeight } = req.body;

    if (!animalId) return res.status(400).json({ error: 'animalId is required' });
    if (!Array.isArray(materialIds) || materialIds.length === 0) {
      return res.status(400).json({ error: 'materialIds (array) is required' });
    }
    const w = Number(totalWeight) || 100;

    const result = await formulaService.optimize({
      animalId: Number(animalId),
      materialIds: materialIds.map(x => Number(x)),
      totalWeight: w
    });

    res.json(result);
  } catch (err) {
    console.error('optimize controller error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.analyze = async (req, res) => {
  try {
    const { animalId, totalWeight, materials } = req.body;

    if (!animalId) return res.status(400).json({ error: 'animalId is required' });
    if (!totalWeight) return res.status(400).json({ error: 'totalWeight is required' });
    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ error: 'materials[] is required' });
    }

    // Call service
    const result = await formulaService.analyze({
      animalId: Number(animalId),
      totalWeight: Number(totalWeight),
      materials
    });

    return res.json({
      message: 'Formula analysis completed',
      data: result
    });
  } catch (error) {
    console.error('Error analyzing formula:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};