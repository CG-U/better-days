-- CreateTable
CREATE TABLE "urges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "trigger" TEXT NOT NULL,
    "notes" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "urges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "urges_userId_occurredAt_idx" ON "urges"("userId", "occurredAt");

-- AddForeignKey
ALTER TABLE "urges" ADD CONSTRAINT "urges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
