import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      return res.json();
    },
  });
};

export const useEnrolStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/students", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Enrolment failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] }); // Invalidate cache
    },
  });
};
