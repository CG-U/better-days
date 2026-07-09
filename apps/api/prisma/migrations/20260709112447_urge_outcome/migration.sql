-- AlterTable
ALTER TABLE "urges" ADD COLUMN     "outcome" TEXT NOT NULL DEFAULT 'unresolved',
ADD COLUMN     "resolvedAt" TIMESTAMP(3);
