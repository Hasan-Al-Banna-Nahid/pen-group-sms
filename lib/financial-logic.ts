/**
 * Business Logic: Determine if a student is in "Good Standing"
 * This can be reused across the Registry and Student modules.
 */
export const getFinancialStatus = (totalFees: number, totalPaid: number) => {
  const balance = totalFees - totalPaid;
  const isOverdue = balance > 0;

  // Feature Intuition: If balance > 50% of fees, flag as "Critical Overdue"
  const isCritical = balance > totalFees * 0.5;

  return {
    balance,
    isOverdue,
    isCritical,
    status: balance <= 0 ? "SETTLED" : "OUTSTANDING",
  };
};
