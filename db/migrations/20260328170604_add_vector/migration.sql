-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "knowledgeDocument" ADD COLUMN     "embedding" vector(1536);
