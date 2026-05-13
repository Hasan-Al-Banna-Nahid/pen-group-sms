/*
  Warnings:

  - You are about to drop the column `programme` on the `Student` table. All the data in the column will be lost.
  - Added the required column `programmeId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Classification" AS ENUM ('DISTINCTION', 'MERIT', 'PASS', 'FAIL');

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "classification" "Classification" NOT NULL DEFAULT 'PASS';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "programme",
ADD COLUMN     "programmeId" TEXT NOT NULL,
ADD COLUMN     "totalFees" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseFee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearlySequence" (
    "year" INTEGER NOT NULL,
    "sequenceNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YearlySequence_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "Programme_name_key" ON "Programme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "YearlySequence_year_key" ON "YearlySequence"("year");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
