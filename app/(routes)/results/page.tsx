"use client";

import { useRole } from "@/app/context/role-context";
import { GradeInputTable } from "@/app/components/assessment/grade-input-table";
import { StudentMarksheet } from "@/app/components/assessment/student-marksheet";
import { useStudents } from "@/app/hooks/use-students";
import { useStudentResults } from "@/app/hooks/use-grades";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, GraduationCap, Info, FileSpreadsheet } from "lucide-react";
// Imported your global loader component to maintain system-wide UI consistency
import GlobalLoader from "@/app/loading";

export default function ResultsPage() {
  const { role } = useRole();
  const { data: students, isLoading: studentsLoading } = useStudents();

  // For simulation, pick first student
  const student = students?.[0];
  const { data: results, isLoading: resultsLoading } = useStudentResults(
    student?.id,
  );

  // 1. Unified load interceptor: Replaces skeleton layouts for both STAFF and STUDENT views
  // until background queries complete execution
  if (studentsLoading || resultsLoading) {
    return <GlobalLoader />;
  }

  // Staff View
  if (role === "STAFF") {
    return (
      <div className="container mx-auto py-10 pt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Academic Results
            </h1>
            <p className="text-slate-500">
              Enter scores, classify performance, and manage result publication.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <Info className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-semibold text-blue-700">
              Financial status automatically controls visibility
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {students?.length || 0}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Graded Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <GradeInputTable />
      </div>
    );
  }

  // Student View
  return (
    <div className="container mx-auto py-10 pt-24 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Academic Marksheet
          </h1>
          <p className="text-slate-500">
            Official record of your assessment performance and classifications.
          </p>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <FileSpreadsheet className="h-5 w-5 text-slate-600" />
        </div>
      </div>

      {student ? (
        <StudentMarksheet student={student} results={results || []} />
      ) : (
        <Card className="border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-white rounded-full border border-slate-100 mb-4">
              <BarChart3 className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-slate-900 font-bold">No Records Found</p>
            <p className="text-slate-500 max-w-xs mt-1">
              We couldn&apos;t find any academic records associated with your
              student ID.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
