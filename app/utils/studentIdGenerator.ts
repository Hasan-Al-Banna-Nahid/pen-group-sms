/**
 * Generates unique student ID
 * Format: SMS-YYYY-0001
 */

export async function generateStudentId(tx: any): Promise<string> {
  const currentYear = new Date().getFullYear();

  let sequence = await tx.yearlySequence.findUnique({
    where: {
      year: currentYear,
    },
  });

  if (!sequence) {
    sequence = await tx.yearlySequence.create({
      data: {
        year: currentYear,
        sequenceNumber: 1,
      },
    });
  } else {
    sequence = await tx.yearlySequence.update({
      where: {
        year: currentYear,
      },
      data: {
        sequenceNumber: {
          increment: 1,
        },
      },
    });
  }

  const formattedNumber = String(sequence.sequenceNumber).padStart(4, "0");

  return `SMS-${currentYear}-${formattedNumber}`;
}
