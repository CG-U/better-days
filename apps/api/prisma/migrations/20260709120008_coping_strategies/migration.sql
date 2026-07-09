-- CreateTable
CREATE TABLE "coping_strategies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "helpedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coping_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "coping_strategies_userId_idx" ON "coping_strategies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "coping_strategies_userId_label_key" ON "coping_strategies"("userId", "label");

-- AddForeignKey
ALTER TABLE "coping_strategies" ADD CONSTRAINT "coping_strategies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
