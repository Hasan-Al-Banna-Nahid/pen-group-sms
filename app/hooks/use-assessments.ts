import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAssessments = () => {
  const queryClient = useQueryClient();

  // Fetch Assessments
  const assessmentsQuery = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const res = await fetch("/api/assessments");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  // Submit Grade Mutation [cite: 30, 31]
  const submitGrade = useMutation({
    mutationFn: async (gradeData: any) => {
      const res = await fetch("/api/grades", {
        method: "POST",
        body: JSON.stringify(gradeData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  return { assessmentsQuery, submitGrade };
};
