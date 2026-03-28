/*
  Warnings:

  - You are about to drop the column `inputCost` on the `model` table. All the data in the column will be lost.
  - You are about to drop the column `outputCost` on the `model` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `model` table. All the data in the column will be lost.
  - You are about to drop the `modelProvider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider` to the `model` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."model" DROP CONSTRAINT "model_providerId_fkey";

-- AlterTable
ALTER TABLE "model" DROP COLUMN "inputCost",
DROP COLUMN "outputCost",
DROP COLUMN "providerId",
ADD COLUMN     "apiKeyEnc" TEXT,
ADD COLUMN     "baseUrl" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."modelProvider";
