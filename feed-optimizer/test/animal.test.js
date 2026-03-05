const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/client");

let testAnimal;
let testNutrient;
let testMaterialType;
let testMaterial;

beforeAll(async () => {
  // Create MaterialType
  testMaterialType = await prisma.materialType.create({
    data: { name: "Grain" },
  });

  // Create Nutrient
  testNutrient = await prisma.nutrient.create({
    data: { name: "Protein", display_unit: "%" },
  });

  // Create Material
  testMaterial = await prisma.material.create({
    data: {
      name: "Corn",
      price_per_kg: 12.5,
      materialTypeId: testMaterialType.id,
    },
  });
});

afterAll(async () => {
  // Clean up
  await prisma.animalFeedLimit.deleteMany();
  await prisma.animalRequirement.deleteMany();
  await prisma.materialNutrientValue.deleteMany();
  await prisma.material.deleteMany();
  await prisma.materialType.deleteMany();
  await prisma.nutrient.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.$disconnect();
});

describe("Animal API", () => {
  it("should create a new animal", async () => {
    const res = await request(app)
      .post("/api/animals")
      .send({ animal_name: "Test Animal" });

    expect(res.statusCode).toBe(201);
    expect(res.body.animal_name).toBe("Test Animal");

    testAnimal = res.body;
  });

  it("should get all animals", async () => {
    const res = await request(app).get("/api/animals");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("animal_name");
  });

  it("should create an animal requirement", async () => {
    const res = await request(app)
      .post(`/api/animals/${testAnimal.id}/requirements`)
      .send({
        nutrientId: testNutrient.id,
        required_value: 12.5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nutrientId).toBe(testNutrient.id);
    expect(res.body.required_value).toBe("12.5000"); // Prisma decimal returns string
  });

  it("should create a feed limit", async () => {
    const res = await request(app)
      .post(`/api/animals/${testAnimal.id}/feed-limits`)
      .send({
        materialId: testMaterial.id,
        min_usage: 5,
        max_usage: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.materialId).toBe(testMaterial.id);
    expect(res.body.min_usage).toBe("5.00");
    expect(res.body.max_usage).toBe("50.00");
  });

  it("should delete an animal", async () => {
    const res = await request(app).delete(`/api/animals/${testAnimal.id}`);
    expect(res.statusCode).toBe(200);

    const deleted = await prisma.animal.findUnique({
      where: { id: testAnimal.id },
    });
    expect(deleted).toBeNull();
  });
});
