-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_programmeId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "programmeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
