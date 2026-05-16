-- CreateEnum
CREATE TYPE "FinancialStatus" AS ENUM ('SETTLED', 'OUTSTANDING', 'CRITICAL_OVERDUE');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "financialStatus" "FinancialStatus" NOT NULL DEFAULT 'OUTSTANDING';
