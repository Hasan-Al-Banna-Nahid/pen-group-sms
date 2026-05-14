import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { studentId: string; amount: number; reference: string }) => {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Payment failed");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate both payments and students to reflect updated balances and statuses
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
