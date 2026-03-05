-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaterialType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MaterialType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nutrient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Material" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price_kg" DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    "materialTypeId" INTEGER NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaterialNutrientValue" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(10,4) NOT NULL,
    "materialId" INTEGER NOT NULL,
    "nutrientId" INTEGER NOT NULL,

    CONSTRAINT "MaterialNutrientValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimalFeedLimit" (
    "id" SERIAL NOT NULL,
    "min_usage" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "max_usage" DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    "animalId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "AnimalFeedLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimalRequirement" (
    "id" SERIAL NOT NULL,
    "required_value" DECIMAL(10,4) NOT NULL,
    "animalId" INTEGER NOT NULL,
    "nutrientId" INTEGER NOT NULL,

    CONSTRAINT "AnimalRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Animal_name_key" ON "public"."Animal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialType_name_key" ON "public"."MaterialType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_name_key" ON "public"."Nutrient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "public"."Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialNutrientValue_materialId_nutrientId_key" ON "public"."MaterialNutrientValue"("materialId", "nutrientId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimalFeedLimit_animalId_materialId_key" ON "public"."AnimalFeedLimit"("animalId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimalRequirement_animalId_nutrientId_key" ON "public"."AnimalRequirement"("animalId", "nutrientId");

-- AddForeignKey
ALTER TABLE "public"."Material" ADD CONSTRAINT "Material_materialTypeId_fkey" FOREIGN KEY ("materialTypeId") REFERENCES "public"."MaterialType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaterialNutrientValue" ADD CONSTRAINT "MaterialNutrientValue_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaterialNutrientValue" ADD CONSTRAINT "MaterialNutrientValue_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "public"."Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimalFeedLimit" ADD CONSTRAINT "AnimalFeedLimit_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimalFeedLimit" ADD CONSTRAINT "AnimalFeedLimit_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimalRequirement" ADD CONSTRAINT "AnimalRequirement_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimalRequirement" ADD CONSTRAINT "AnimalRequirement_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "public"."Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
