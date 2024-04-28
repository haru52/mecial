/*
  Warnings:

  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[screenName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_name_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "name",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "screenName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Post_content_idx" ON "Post"("content");

-- CreateIndex
CREATE UNIQUE INDEX "User_screenName_key" ON "User"("screenName");

-- CreateIndex
CREATE INDEX "User_screenName_idx" ON "User"("screenName");
