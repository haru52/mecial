/*
  Warnings:

  - Added the required column `isPrivate` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL;
