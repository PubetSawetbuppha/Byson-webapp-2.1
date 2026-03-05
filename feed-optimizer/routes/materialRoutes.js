const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialControllers');

/// MATERIAL ROUTES 
router.get('/materials', materialController.getAllMaterials);
router.get('/materials/:id', materialController.getMaterialById);
router.post('/materials', materialController.createMaterial);
router.put('/materials/:id', materialController.updateMaterial);
router.delete('/materials/:id', materialController.deleteMaterial);
router.put('/materials/:id/nutrients', materialController.updateMaterialNutrients);


/// MATERIAL NUTRIENT VALUE ROUTES
router.get('/values', materialController.getAllValues);
router.get('/values/:materialId/nutrients', materialController.getValueByMaterial);
router.post('/values', materialController.createValue);
router.put('/values/:id', materialController.updateValue);
router.delete('/values/:materialId/nutrients', materialController.deleteValue);

/// MATERIAL TYPE ROUTES
router.get('/material-types', materialController.getAllMaterialTypes);
router.post('/material-types', materialController.createMaterialType);
router.delete('/material-types/:id', materialController.deleteMaterialType);

/// NUTRIENT ROUTES
router.get('/nutrients', materialController.getAllNutrients);
router.post('/nutrients', materialController.createNutrient);
router.delete('/nutrients/:id', materialController.deleteNutrient);

module.exports = router;