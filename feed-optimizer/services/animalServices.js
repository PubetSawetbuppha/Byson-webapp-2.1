const dbRepo = require('../repositories/animalRepo');


/// ANIMAL ///
exports.getAllAnimals = () => dbRepo.animal.findAll();
exports.getAnimalById = (id) => dbRepo.animal.findById(Number(id));
exports.createAnimal = (payload) => dbRepo.animal.create(payload);
exports.updateAnimal = (id, payload) => dbRepo.animal.update(Number(id), payload);
exports.deleteAnimal = (id) => dbRepo.animal.delete(Number(id));

/// ANIMAL REQUIREMENT ///
exports.getAllRequirements = () =>
  dbRepo.animalRequirement.findAll();
exports.getRequirementsByAnimal = (animalId) =>
  dbRepo.animalRequirement.getByAnimal(Number(animalId));
exports.createRequirement = (payload) =>
  dbRepo.animalRequirement.create(payload);
exports.updateRequirement = (id, payload) =>
  dbRepo.animalRequirement.update(Number(id), payload);
exports.deleteRequirementByAnimalId = async (animalId) => {
  const existingRequirement = await dbRepo.animalRequirement.getByAnimal(Number(animalId));
if (!existingRequirement.length) {
  throw new Error('No requirements found for this animal');
}
  return dbRepo.animalRequirement.delete(Number(animalId));
};


/// ANIMAL FEED LIMIT ///
exports.getAllFeedLimits = (id) =>
  dbRepo.animalFeedLimit.findAll();
exports.getFeedLimitsByAnimalId = (animalId) =>
  dbRepo.animalFeedLimit.getByAnimal(Number(animalId)); 
exports.createFeedLimit = (payload) =>
  dbRepo.animalFeedLimit.create(payload);
exports.updateFeedLimit = (id, payload) =>
  dbRepo.animalFeedLimit.update(Number(id), payload);
exports.deleteFeedLimitByAnimalId = async (animalId) => {
  const existingFeedLimit = await dbRepo.animalFeedLimit.getByAnimal(Number(animalId));
if (!existingFeedLimit.length) {
  throw new Error('No feed limits found for this animal');
}
  return dbRepo.animalFeedLimit.delete(Number(animalId));
};
//new logic
exports.getFormulationMaterialsByAnimal = async (animalId) => {
  const limits = await dbRepo.animalFeedLimit.getByAnimal(Number(animalId));
  return limits.map(l => ({
    id: l.material.id,
    name: l.material.name,
    price_kg: Number(l.material.price_kg),
    _group: l.material.materialType?.name,
    minLimit: Number(l.min_usage),
    maxLimit: Number(l.max_usage),
    nutrientValues: l.material.nutrientValues, // Analyze page will need this
  }));
};