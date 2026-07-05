-- CreateTable
CREATE TABLE "relapses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountSpentCents" INTEGER NOT NULL,
    "trigger" TEXT NOT NULL,
    "notes" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relapses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "relapses_userId_occurredAt_idx" ON "relapses"("userId", "occurredAt");

-- AddForeignKey
ALTER TABLE "relapses" ADD CONSTRAINT "relapses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
