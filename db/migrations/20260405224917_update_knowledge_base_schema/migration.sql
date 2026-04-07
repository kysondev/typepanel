/*
  Warnings:

  - Added the required column `updatedAt` to the `knowledgeBase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "knowledgeBase" ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "chatbotId" DROP NOT NULL;
