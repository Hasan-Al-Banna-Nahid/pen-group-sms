"use client";

import { useRole } from "@/app/context/role-context";
import { useQuery } from "@tanstack/react-query";
import { CreateAssessmentFlow } from "@/app/components/assessment/create-flow-modal";
import { AssessmentCard } from "@/app/components/assessment/assessment-card";
// Imported your global loader component to maintain consistency across pages
import GlobalLoader from "@/app/loading";

export default function AssessmentPage() {
  const { role } = useRole(); // Global role context from Layout

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments", role], // Re-fetch data automatically when role toggles
    queryFn: async () => {
      const res = await fetch("/api/assessments");
      if (!res.ok) throw new Error("API Connection Failed");
      return res.json();
    },
  });

  // 1. Return the global loader directly until the API responds with data
  if (isLoading) {
    return <GlobalLoader />;
  }

  // 2. Main content renders seamlessly once isLoading becomes false
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {role === "STAFF" ? "Academic Registry" : "My Curriculum"}
          </h1>
          <p className="text-muted-foreground text-sm italic">
            {role === "STAFF"
              ? "Create units and grade students."
              : "View tasks and track your grades."}
          </p>
        </div>

        {/* Step-by-step creation flow visible only to Staff */}
        {role === "STAFF" && <CreateAssessmentFlow />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments?.length > 0 ? (
          assessments.map((item: any) => (
            <AssessmentCard key={item.id} assessment={item} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
            <p className="text-slate-400">
              No active assessments found in the registry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
