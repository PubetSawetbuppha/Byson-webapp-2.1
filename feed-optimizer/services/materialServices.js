const { material } = require('../prisma/client');
const dbRepo = require('../repositories/materialRepo');

// --- MATERIAL ---
exports.getAllMaterials = async () => {
  return await dbRepo.material.findAll();
};

exports.getMaterialById = async (id) => {
  return await dbRepo.material.findById(Number(id));
};

exports.createMaterial = async (payload) => {
  return await dbRepo.material.create(payload);
};

exports.updateMaterial = async (id, payload) => {
  const existingMaterial = await dbRepo.material.findById(Number(id));
  if (!existingMaterial) throw new Error("Material not found");
  return await dbRepo.material.update(Number(id),payload);
};

exports.deleteMaterial = async (id) => {
  const existingMaterial = await dbRepo.material.findById(Number(id));
  if (!existingMaterial) throw new Error('Material not found');
  return await dbRepo.material.delete(Number(id));
};

// --- MATERIAL NUTRIENT VALUES ---

exports.getAllValues = async () => {
  return await dbRepo.materialNutrientValue.findAll();
};

exports.getValuesByMaterial = async (materialId) => {
  return await dbRepo.materialNutrientValue.getByMaterial(Number(materialId));
};

exports.createValue = async (payload) => {
  return await dbRepo.materialNutrientValue.create(payload);
};

exports.updateValue = async (id, payload) => {
  const existingValue = await dbRepo.materialNutrientValue.findById(Number(id));
  if (!existingValue) throw new Error("Value not found");
  return await dbRepo.materialNutrientValue.update(Number(id),payload);
};

exports.deleteMaterialNutrients = async (materialId) => {
  const existingMaterial = await dbRepo.material.findById(Number(materialId));
  if (!existingMaterial) {
    throw new Error('Material not found');
  }
  return dbRepo.materialNutrientValue.delete(Number(materialId));
};


// --- MATERIAL TYPES ---
exports.getALLMaterialTypes = async () => {
  return await dbRepo.materialType.findAll();
};
exports.createMaterialType = async (payload) => {
  return await dbRepo.materialType.create(payload);
};
exports.deleteMaterialType = async (id) => {
  const existingMaterialType = await dbRepo.materialType.findById(Number(id));
  if (!existingMaterialType) throw new Error('Material not found');
  return await dbRepo.materialType.delete(Number(id));
};

// --- NUTRIENTS ---
exports.getAllNutrients = async () => {
  return await dbRepo.nutrient.findAll();
};
exports.createNutrient = async (payload) => {
  return await dbRepo.nutrient.create(payload);
};
exports.deleteNutrient = async (id) => {
  const existingNutrient = await dbRepo.nutrient.findById(Number(id));
  if (!existingNutrient) throw new Error('Material not found');
  return await dbRepo.nutrient.delete(Number(id));
};



exports.updateMaterialNutrients = async (materialId, nutrients) => {
  // Check material exists
  const material = await dbRepo.materialNutrientValue.getByMaterial(materialId);
  if (!material) throw new Error('Material not found');

  // Loop and upsert
  const updates = await Promise.all(
    nutrients.map((nutrient) =>
      dbRepo.upsertNutrientValue(materialId, nutrient.nutrientId, nutrient.value)
    )
  );

  return updates;
 }; 