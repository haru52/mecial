-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentSocialId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentSocialId_fkey" FOREIGN KEY ("currentSocialId") REFERENCES "Social"("id") ON DELETE SET NULL ON UPDATE CASCADE;
