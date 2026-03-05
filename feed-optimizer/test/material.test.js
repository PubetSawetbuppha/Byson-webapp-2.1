// test/api.test.js
const request = require('supertest');
const app = require('../app'); // your Express app
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Feed Optimizer API', () => {
  let materialTypeId;
  let materialId;
  let nutrientId;
  let nutrientValueId;

  // Setup: create a MaterialType and a Nutrient
  beforeAll(async () => {
    const mtRes = await request(app)
      .post('/material-types')
      .send({ name: `Test Type ${Date.now()}` });
    expect(mtRes.statusCode).toBe(201);
    materialTypeId = mtRes.body.data.id;

    const nRes = await request(app)
      .post('/nutrients')
      .send({ name: `Test Nutrient ${Date.now()}`, display_unit: 'g/kg' });
    expect(nRes.statusCode).toBe(201);
    nutrientId = nRes.body.data.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.materialNutrientValue.deleteMany();
    await prisma.material.deleteMany();
    await prisma.materialType.deleteMany();
    await prisma.nutrient.deleteMany();
    await prisma.$disconnect();
  });

  /// MATERIAL ROUTES ///
  it('POST /materials - create a material', async () => {
    const res = await request(app)
      .post('/materials')
      .send({
        name: `Test Material ${Date.now()}`,
        price_per_kg: 100,
        materialTypeId
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    materialId = res.body.data.id;
  });

  it('GET /materials - get all materials', async () => {
    const res = await request(app).get('/materials');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /materials/:id - get material by id', async () => {
    const res = await request(app).get(`/materials/${materialId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', materialId);
  });

  it('PUT /materials/:id - update material', async () => {
    const updatedName = `Updated Material ${Date.now()}`;
    const res = await request(app)
      .put(`/materials/${materialId}`)
      .send({ name: updatedName });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', materialId);
    expect(res.body.data.name).toBe(updatedName);
  });

  it('DELETE /materials/:id - delete material', async () => {
    const res = await request(app).delete(`/materials/${materialId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Material deleted successfully');
  });

  /// MATERIAL NUTRIENT VALUE ROUTES ///
 it('POST /values - create nutrient value', async () => {
  // First, create a material again
  const matRes = await request(app)
    .post('/materials')
    .send({
      name: `Material for Nutrient ${Date.now()}`,
      price_per_kg: 50,
      materialTypeId
    });
  expect(matRes.statusCode).toBe(201);
  materialId = matRes.body.data.id;

  const res = await request(app)
    .post('/values')
    .send({ materialId, nutrientId, value: 10 }); // single object
  expect(res.statusCode).toBe(201);
  expect(res.body.data).toHaveProperty('id');
  expect(Number(res.body.data.value)).toBeCloseTo(10, 4);

  nutrientValueId = res.body.data.id; // save id for PUT test
});

it('PUT /values/:id - update nutrient value', async () => {
  const updatedValue = 20;
  const res = await request(app)
    .put(`/values/${nutrientValueId}`)
    .send({ value: updatedValue });
  expect(res.statusCode).toBe(200);
  expect(res.body.data).toHaveProperty('id', nutrientValueId);
  expect(Number(res.body.data.value)).toBeCloseTo(updatedValue, 4);
});

  it('GET /values - get all nutrient values', async () => {
    const res = await request(app).get('/values');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /values/:materialId/nutrients - get material nutrients', async () => {
    const res = await request(app).get(`/values/${materialId}/nutrients`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('nutrient');
  });

  ///Get nutrient
  it('GET /values/:materialId/nutrients - get material nutrients', async () => {
  const res = await request(app).get(`/values/${materialId}/nutrients`);
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data[0]).toHaveProperty('nutrient');
  expect(res.body.data[0]).toHaveProperty('value');
  });

  it('DELETE /values/:materialId - delete material nutrient', async () => {
    const res = await request(app).delete(`/values/${materialId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'value deleted successfully');
  });

  /// MATERIAL TYPE ROUTES ///
  it('GET /material-types - get all material types', async () => {
    const res = await request(app).get('/material-types');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /material-types - create material type', async () => {
    const res = await request(app)
      .post('/material-types')
      .send({ name: `Another Type ${Date.now()}` });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
  });

it('DELETE /material-types/:id - delete material type', async () => {
  // first remove all materials using this type
  await prisma.material.deleteMany({ where: { materialTypeId } });

  const res = await request(app).delete(`/material-types/${materialTypeId}`);
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('message', 'Material Type deleted successfully');
});

  /// NUTRIENT ROUTES ///

  it('POST /nutrients - create nutrient', async () => {
    const res = await request(app)
      .post('/nutrients')
      .send({ name: `Another Nutrient ${Date.now()}`, display_unit: 'g/kg' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
  });

  it('DELETE /nutrients/:id - delete nutrient', async () => {
    const res = await request(app).delete(`/nutrients/${nutrientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Nutrient deleted successfully');
  });
});
