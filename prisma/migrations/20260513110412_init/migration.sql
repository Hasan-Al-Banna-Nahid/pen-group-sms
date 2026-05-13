/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "isPublished";
