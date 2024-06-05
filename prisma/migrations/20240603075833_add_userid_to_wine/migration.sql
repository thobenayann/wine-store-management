/*
  Warnings:

  - Added the required column `userId` to the `Wine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wine" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "user_id_index" ON "User"("id");

-- CreateIndex
CREATE INDEX "wines_user_id_index" ON "Wine"("userId");

-- AddForeignKey
ALTER TABLE "Wine" ADD CONSTRAINT "Wine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
