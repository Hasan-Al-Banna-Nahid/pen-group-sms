/**
 * Business Logic: Determine if a student is in "Good Standing"
 * This can be reused across the Registry and Student modules.
 */
export const getFinancialStatus = (totalFees: number, totalPaid: number, dueDate?: Date | null) => {
  const balance = totalFees - totalPaid;
  const isSettled = balance <= 0;
  
  const currentDate = new Date();
  const isOverdue = !isSettled && (dueDate ? currentDate > new Date(dueDate) : false);

  // If balance > 50% of fees OR it's overdue, flag as "Critical"
  const isCritical = !isSettled && (balance > totalFees * 0.5 || isOverdue);

  return {
    balance,
    isOverdue,
    isCritical,
    status: isSettled ? "SETTLED" : "OUTSTANDING",
  };
};
