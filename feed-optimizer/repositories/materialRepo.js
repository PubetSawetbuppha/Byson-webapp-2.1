const prisma = require('../prisma/client');

/// MATERIAL ///
exports.material = {
  findAll: () =>
    prisma.material.findMany({
      include: {
        materialType: true,
        nutrientValues: { include: { nutrient: true } },
      },
    }),

  findById: (id) =>
    prisma.material.findUnique({
      where: { id: Number(id) },
      include: {
        materialType: true,
        nutrientValues: { include: { nutrient: true } },
      },
    }),

  create: (data) => prisma.material.create({ data }),
  update: (id, data) => prisma.material.update({ where: { id: Number(id) }, data }),
  delete: (id) => prisma.material.delete({ where: { id: Number(id) } }),
};

/// MATERIAL TYPE ///
exports.materialType = {
  findAll: () => prisma.materialType.findMany(),
  findById: (id) => prisma.materialType.findUnique({ where: { id: Number(id) } }),
  create: (data) => prisma.materialType.create({ data }),
  update: (id, data) => prisma.materialType.update({ where: { id: Number(id) }, data }),
  delete: (id) => prisma.materialType.delete({ where: { id: Number(id) } }),
};

/// NUTRIENT ///
exports.nutrient = {
  findAll: () => prisma.nutrient.findMany(),
  findById: (id) => prisma.nutrient.findUnique({ where: { id: Number(id) } }),
  create: (data) => prisma.nutrient.create({ data }),
  update: (id, data) => prisma.nutrient.update({ where: { id: Number(id) }, data }),
  delete: (id) => prisma.nutrient.delete({ where: { id: Number(id) } }),
};

/// MATERIAL NUTRIENT VALUE ///
exports.materialNutrientValue = {
  findAll: () => prisma.materialNutrientValue.findMany(),
  findById: (id) =>
    prisma.materialNutrientValue.findUnique({
      where: { id: Number(id) },
      include: { nutrient: true },
    }),
  create: (data) => prisma.materialNutrientValue.create({ data }),
  update: (id, data) =>
    prisma.materialNutrientValue.update({ where: { id: Number(id) }, data }),
  delete: (materialId) => prisma.materialNutrientValue.deleteMany({ where: { materialId: Number(materialId) } }),

  // Get nutrient values for a material
  getByMaterial: (materialId) =>
    prisma.materialNutrientValue.findMany({
      where: { materialId: Number(materialId) },
      include: { nutrient: true },
    }),

};

exports.upsertNutrientValue = async (materialId, nutrientId, value) => {
  return prisma.materialNutrientValue.upsert({
    where: {
      materialId_nutrientId: {
        materialId: Number(materialId),
        nutrientId: Number(nutrientId),
      },
    },
    update: { value },
    create: { materialId: Number(materialId), nutrientId: Number(nutrientId), value },
  });
};