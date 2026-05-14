import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const res = await fetch("/api/grade/all"); // I'll need to create this endpoint
      if (!res.ok) throw new Error("Failed to fetch grades");
      return res.json();
    },
  });
};

export const useStudentResults = (studentId?: string) => {
  return useQuery({
    queryKey: ["student-results", studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const res = await fetch(`/api/students/${studentId}/results`);
      if (!res.ok) throw new Error("Failed to fetch results");
      return res.json();
    },
    enabled: !!studentId,
  });
};

export const useUpsertGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { studentId: string; assessmentId: string; score: number; isPublished?: boolean }) => {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Grading failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["student-results"] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
};
