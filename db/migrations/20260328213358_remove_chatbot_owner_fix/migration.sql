/*
  Warnings:

  - You are about to drop the column `ownerId` on the `chatBot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."chatBot" DROP CONSTRAINT "chatBot_ownerId_fkey";

-- AlterTable
ALTER TABLE "chatBot" DROP COLUMN "ownerId";
