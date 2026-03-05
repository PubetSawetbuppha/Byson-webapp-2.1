const animalService = require('../services/animalServices');

/// ANIMALS ///
// GET /animals
exports.getAnimals = async (req, res) => {
  try {
    const animals = await animalService.getAllAnimals();
    res.json({ data: animals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /animals/:id
exports.getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await animalService.getAnimalById(Number(id));
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json({ data: animal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /animals
exports.createAnimal = async (req, res) => {
  try {
    const payload = req.body;
    const newAnimal = await animalService.createAnimal(payload);
    res.status(201).json({ data: newAnimal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /animals/:id
exports.updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updatedAnimal = await animalService.updateAnimal(Number(id), payload);
    res.json({ data: updatedAnimal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /animals/:id
exports.deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    await animalService.deleteAnimal(Number(id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/// ANIMAL REQUIREMENT ///

// GET ALL /requirements
exports.getRequirements = async (req, res) => {
  try {
    const requirements = await animalService.getAllRequirements();
    res.json({ data: requirements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /animals/:animalId/requirements
exports.getRequirementsByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const requirements = await animalService.getRequirementsByAnimal(Number(animalId));
    res.json({ data: requirements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// POST /requirements
exports.createRequirement = async (req, res) => {
  try {
    const payload = req.body;
    const newRequirement = await animalService.createRequirement(payload);
    res.status(201).json({ data: newRequirement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /requirements/:id
exports.updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updatedRequirement = await animalService.updateRequirement(Number(id), payload);
    res.json({ data: updatedRequirement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /animals/:animalId/requirements
exports.deleteRequirementsByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params; // Parameter is `animalId` as per route '/animals/:animalId/requirements'
    await animalService.deleteRequirementByAnimalId(Number(animalId));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/// ANIMAL FEED LIMIT ///

// GET /feed-limits/:id
exports.getFeedLimits = async (req, res) => {
  try {
    const FeedLimits = await animalService.getAllFeedLimits();
    res.json({ data: FeedLimits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /animals/:animalId/feed-limits
exports.getFeedLimitsByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params; // Parameter is `animalId` as per route '/animals/:animalId/feed-limits'
    const FeedLimits = await animalService.getFeedLimitsByAnimalId(Number(animalId));
    res.json({ data: FeedLimits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /feed-limits
exports.createFeedLimit = async (req, res) => {
  try {
    const payload = req.body;
    const newFeedLimit = await animalService.createFeedLimit(payload);
    res.status(201).json({ data: newFeedLimit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /feed-limits/:id
exports.updateFeedLimit = async (req, res) => {
  try {
    const { id } = req.params; // Parameter is `id` as per route '/feed-limits/:id'
    const payload = req.body;
    const updatedFeedLimit = await animalService.updateFeedLimit(Number(id), payload);
    res.json({ data: updatedFeedLimit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /animals/:animalId/feed-limits
exports.deleteFeedLimitsByAnimal = async (req, res) => { // <--- RENAMED method for consistency
  try {
    const { animalId } = req.params; // Parameter is `animalId` as per route '/animals/:animalId/feed-limits'
    await animalService.deleteFeedLimitByAnimalId(Number(animalId)); // <--- FIXED: Calls correctly named service method
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//feed limits
exports.getFormulationMaterials = async (req, res) => {
  try {
    const { animalId } = req.params;
    const data = await animalService.getFormulationMaterialsByAnimal(animalId);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};