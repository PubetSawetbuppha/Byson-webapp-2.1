const prisma = require('../prisma/client');
const { nutrient } = require('./materialRepo');

module.exports = {
  // fetch material rows by array of ids with nutrient values included
  getMaterialsByIds: (ids = []) =>
    prisma.material.findMany({
      where: { id: { in: ids } },
      include: {
        nutrientValues: { include: { nutrient: true } },
        materialType: true,
        feedLimits: true
      },
    }),

  // fetch animal requirements by animal id
  getAnimalRequirements: (animalId) =>
    prisma.animalRequirement.findMany({
      where: { animalId },
      include: { nutrient: true },
    }),

  // fetch feed limits for an animal
  getFeedLimitsForAnimal: (animalId) =>
    prisma.animalFeedLimit.findMany({
      where: { animalId },
      include: { material: true },
    }),

};
