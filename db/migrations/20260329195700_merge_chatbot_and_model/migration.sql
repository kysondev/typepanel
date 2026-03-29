/*
  Warnings:

  - You are about to drop the column `modelId` on the `chatBot` table. All the data in the column will be lost.
  - You are about to drop the `model` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `model` to the `chatBot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `chatBot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."chatBot" DROP CONSTRAINT "chatBot_modelId_fkey";

-- AlterTable
ALTER TABLE "chatBot" DROP COLUMN "modelId",
ADD COLUMN     "apiKeyEnc" TEXT,
ADD COLUMN     "baseUrl" TEXT,
ADD COLUMN     "contextLength" INTEGER,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "temperature" DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."model";
