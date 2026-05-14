-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "feeDueDate" TIMESTAMP(3);
