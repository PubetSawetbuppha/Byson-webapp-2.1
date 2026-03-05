const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalControllers');

/// ANIMALS ///
router.get('/animals', animalController.getAnimals);
router.get('/animals/:id', animalController.getAnimalById);
router.post('/animals', animalController.createAnimal);
router.put('/animals/:id', animalController.updateAnimal);
router.delete('/animals/:id', animalController.deleteAnimal);

/// ANIMAL REQUIREMENTS ///
router.get('/requirements', animalController.getRequirements);
router.get('/animals/:animalId/requirements', animalController.getRequirementsByAnimal);
router.post('/requirements', animalController.createRequirement);
router.put('/requirements/:id', animalController.updateRequirement);
router.delete('/animals/:animalId/requirements', animalController.deleteRequirementsByAnimal);

/// ANIMAL FEED LIMITS ///
router.get('/feed-limits', animalController.getFeedLimits);
router.get('/animals/:animalId/feed-limits', animalController.getFeedLimitsByAnimal);
router.post('/feed-limits', animalController.createFeedLimit);
router.put('/feed-limits/:id', animalController.updateFeedLimit);
router.delete('/animals/:animalId/feed-limits', animalController.deleteFeedLimitsByAnimal);
router.get('/animals/:animalId/formulation-materials', animalController.getFormulationMaterials);

module.exports = router;
