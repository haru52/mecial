/*
  Warnings:

  - Added the required column `administratorId` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" ALTER COLUMN "isPrivate" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Follows" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "administratorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Avatar_socialId_userId_idx" ON "Avatar"("socialId", "userId");

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
