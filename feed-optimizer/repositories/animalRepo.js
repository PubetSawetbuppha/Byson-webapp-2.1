const prisma = require('../prisma/client');

/// ANIMAL ///
exports.animal = {
  findAll: () => prisma.animal.findMany(),
  findById: (id) => prisma.animal.findUnique({ where: { id: Number(id) } }),
  create: (data) => {
    const payload = {
      // accept either animal_name or name from controllers/tests
      name: data.animal_name ?? data.name,
    };
    if (!payload.name) throw new Error('animal name is required');
    return prisma.animal.create({ data: payload });
  },
  update: (id, data) => {
    const payload = {};
    if (data.animal_name ?? data.name) payload.name = data.animal_name ?? data.name;
    return prisma.animal.update({ where: { id: Number(id) }, data: payload });
  },
  delete: (id) => prisma.animal.delete({ where: { id: Number(id) } }),
};

/// ANIMAL REQUIREMENT ///
exports.animalRequirement = {
  findAll: () =>
    prisma.animalRequirement.findMany({ include: { nutrient: true } }),
  findById: (id) =>
    prisma.animalRequirement.findUnique({
      where: { id: Number(id) },
      include: { nutrient: true },
    }),
  create: (data) =>
    prisma.animalRequirement.create({
      data: {
        required_value: data.required_value,
        animal: { connect: { id: Number(data.animalId) } },
        nutrient: { connect: { id: Number(data.nutrientId) } },
      },
    }),
  update: (id, data) =>
    prisma.animalRequirement.update({
      where: { id: Number(id) },
      data: { required_value: data.required_value },
    }),
  delete: (animalId) => prisma.animalRequirement.deleteMany({ where: { animalId: Number(animalId) } }),

  // Get requirements for a specific animal
  getByAnimal: (animalId) =>
    prisma.animalRequirement.findMany({
      where: { animalId: Number(animalId) },
      include: { nutrient: true },
    }),
};

/// ANIMAL FEED LIMIT ///
exports.animalFeedLimit = {
  findAll: () =>
    prisma.animalFeedLimit.findMany({
      include: { animal: true, material: true },
    }),
  findById: (id) =>
    prisma.animalFeedLimit.findUnique({
      where: { id: Number(id) },
      include: { animal: true, material: true },
    }),
  create: (data) =>
    prisma.animalFeedLimit.create({
      data: {
        min_usage: data.min_usage,
        max_usage: data.max_usage,
        animal: { connect: { id: Number(data.animalId) } },
        material: { connect: { id: Number(data.materialId) } },
      },
    }),
  update: (id, data) =>
    prisma.animalFeedLimit.update({
      where: { id: Number(id) },
      data: {
        ...(data.min !== undefined ? { min_usage: data.min } : {}),
        ...(data.max !== undefined ? { max_usage: data.max } : {}),
        ...(data.min_usage !== undefined ? { min_usage: data.min_usage } : {}),
        ...(data.max_usage !== undefined ? { max_usage: data.max_usage } : {}),
      },
    }),
  delete: (animalId) => prisma.animalFeedLimit.deleteMany({ where: { animalId: Number(animalId) } }),


  //old logic
  // getByAnimal: (animalId) =>
  //   prisma.animalFeedLimit.findMany({
  //     where: { animalId: Number(animalId) },
  //     include: { animal: true, material: true },
  //   }),

  getByAnimal: (animalId) =>
  prisma.animalFeedLimit.findMany({
    where: { animalId: Number(animalId) },
    include: {
      material: {
        include: {
          materialType: true,
          nutrientValues: {
            include: { nutrient: true }
          }
        }
      }
    },
  }),
};
