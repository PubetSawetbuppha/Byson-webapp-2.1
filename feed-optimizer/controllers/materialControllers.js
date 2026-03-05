const materialService = require('../services/materialServices');

/// MATERIAL SECTION ****************************************** ///

// GET /api/materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await materialService.getAllMaterials();
    res.status(200).json({ data: materials });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/materials/:id
exports.getMaterialById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const material = await materialService.getMaterialById(id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.status(200).json({ data: material });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/materials
exports.createMaterial = async (req, res) => {
  try {
    const payload = req.body;
    console.log('Payload:', payload);
    const newMaterial = await materialService.createMaterial(payload);
    res.status(201).json({ data: newMaterial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/materials/:id
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updatedMaterial = await materialService.updateMaterial(id, payload);
    res.status(200).json({ data: updatedMaterial });
  } catch (err) {
    if (err.message === "Material not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await materialService.deleteMaterial(Number(id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete material', error: err.message });
  }
};

/// MATERIAL NUTRIENT VALUES ********************************************** ///

// GET /api/values
exports.getAllValues = async (req, res) => {
  try {
    const values = await materialService.getAllValues();
    res.status(200).json({ data: values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/values/:materialId/nutrients
exports.getValueByMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const values = await materialService.getValuesByMaterial(Number(materialId));
    res.status(200).json({ data: values });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch nutrients for material', error: err.message });
  }
};

// POST /api/values
exports.createValue = async (req, res) => {
  try {
    const payload = req.body;
    console.log('Payload:', payload);
    const newValue = await materialService.createValue(payload);
    res.status(201).json({ data: newValue });
  } catch (err) {
    console.error('Full Prisma Error:', err);
    console.error('Error code:', err.code);
    console.error('Error meta:', err.meta);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/values/:id
exports.updateValue = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updatedValue = await materialService.updateValue(id, payload);
    res.status(200).json({ data: updatedValue });
  } catch (err) {
    if (err.message === "Value not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};


// DELETE /api/values/:id
exports.deleteValue = async (req, res) => {
  try {
    const { materialId } = req.params;
    await materialService.deleteMaterialNutrients(Number(materialId));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete value', error: err.message });
  }
};




/// MATERIAL TYPES ********************************************** ///

// GET /api/material-types
exports.getAllMaterialTypes = async (req, res) => {
  try {
    const newMaterialTypes = await materialService.getALLMaterialTypes();
    res.status(200).json({ data: newMaterialTypes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/material-types
exports.createMaterialType = async (req, res) => {
  try {
    const payload = req.body;
    const newMaterialType = await materialService.createMaterialType(payload);
    res.status(201).json({ data: newMaterialType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/material-types/:id
exports.deleteMaterialType = async (req, res) => {
  try {
    const { id } = req.params;
    await materialService.deleteMaterialType(Number(id));
    res.status(204).send();
  } catch (err) {
    // handle foreign key constraint error
    if (err.code === 'P2003') {
      return res.status(400).json({
        message: 'Cannot delete material type because it is used by existing materials'
      });
    }
    // fallback for other errors
    console.error(err);
    res.status(500).json({
      message: 'Failed to delete material type',
      error: err.message
    });
  }
};


/// NUTRIENTS ********************************************** ///

// GET /api/nutrients
exports.getAllNutrients = async (req, res) => {
  try {
    const nutrient = await materialService.getAllNutrients();
    res.status(200).json({ data: nutrient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/nutrients
exports.createNutrient = async (req, res) => {
  try {
    const payload = req.body;
    const newNutrient = await materialService.createNutrient(payload);
    res.status(201).json({ data: newNutrient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/nutrients/:id
exports.deleteNutrient = async (req, res) => {
  try {
    const { id } = req.params;
    await materialService.deleteNutrient(Number(id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete nutrient', error: err.message });
  }
};

exports.updateMaterialNutrients = async (req, res) => {
  try {
    const materialId = req.params.id;
    const { nutrients } = req.body;

    if (!Array.isArray(nutrients)) {
      return res.status(400).json({ error: 'nutrients[] is required' });
    }

    const result = await materialService.updateMaterialNutrients(materialId, nutrients);

    res.json({ message: 'Nutrients updated successfully', data: result });
  } catch (err) {
    console.error('Error updating nutrients:', err);
    res.status(500).json({ error: err.message });
  }
};