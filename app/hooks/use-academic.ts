import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAcademic = () => {
  const queryClient = useQueryClient();

  // Fetch all assessments with relations
  const assessmentsQuery = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const res = await fetch("/api/assessments");
      if (!res.ok) throw new Error("Failed to fetch assessments");
      return res.json();
    },
  });

  // Create Assessment Mutation (Staff)
  const createAssessment = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/assessments", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["assessments"] }),
  });

  return { assessmentsQuery, createAssessment };
};
