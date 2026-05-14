"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  AlertCircle,
  Save,
  ExternalLink,
  RotateCcw,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/app/context/role-context";
import { cn } from "@/lib/utils"; // shadcn utility

export const AssessmentCard = ({
  assessment: initialData,
}: {
  assessment: any;
}) => {
  const { role } = useRole();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [scoreInput, setScoreInput] = useState<number | "">("");

  // Real-time synchronization
  const { data: assessments, isError } = useQuery({
    queryKey: ["assessments"],
    queryFn: () =>
      fetch("/api/assessments").then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    initialData: [initialData],
    refetchInterval: 1500,
  });

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetch("/api/students").then((res) => res.json()),
  });

  const currentAssessment =
    assessments?.find((a: any) => a.id === initialData.id) || initialData;

  // Business Logic & Edge Case Handling
  const studentData = useMemo(() => {
    if (!selectedStudentId || !currentAssessment) return null;

    const submission = currentAssessment.submissions?.find(
      (s: any) => s.studentId === selectedStudentId,
    );
    const gradeRecord = currentAssessment.grades?.find(
      (g: any) => g.studentId === selectedStudentId,
    );

    const getClass = (score: number) => {
      if (score >= 70) return { label: "Distinction", color: "bg-purple-600" };
      if (score >= 60) return { label: "Merit", color: "bg-blue-600" };
      if (score >= 40) return { label: "Pass", color: "bg-emerald-600" };
      return { label: "Fail", color: "bg-rose-600" };
    };

    const isLate =
      submission &&
      new Date(submission.submittedAt) > new Date(currentAssessment.deadline);
    const isDeadlinePassed = new Date() > new Date(currentAssessment.deadline);

    // Logic: Only allow late submission if NO submission exists
    const canSubmit = !isDeadlinePassed || !submission;

    return {
      submission,
      grade: gradeRecord,
      isLate,
      isDeadlinePassed,
      canSubmit,
      status: gradeRecord ? getClass(gradeRecord.score) : null,
    };
  }, [currentAssessment, selectedStudentId]);

  useEffect(() => {
    setScoreInput(studentData?.grade ? studentData.grade.score : "");
  }, [studentData?.grade, selectedStudentId]);

  // Grading Mutation with Blur Effect State
  const gradingMutation = useMutation({
    mutationFn: async (score: number) => {
      if (score < 0 || score > 100) throw new Error("Invalid score range");
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          assessmentId: currentAssessment.id,
          score,
          isPublished: true,
        }),
      });
      if (!res.ok) throw new Error("Registry Update Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Marks synced and published");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Upload Mutation with Resubmission Prevention logic
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentId", selectedStudentId);
      formData.append("assessmentId", currentAssessment.id);
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "File Vault error");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Script uploaded to Registry");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const isStaff = String(role).toUpperCase() === "STAFF";
  const isStudent = String(role).toUpperCase() === "STUDENT";

  return (
    <Card className="w-full max-w-lg border-2 rounded-[2.5rem] bg-white overflow-hidden shadow-2xl relative">
      {/* 1. Global Blur Loader for Staff Actions */}
      {gradingMutation.isPending && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md transition-all">
          <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
          <p className="mt-2 text-[10px] font-black uppercase text-slate-900 tracking-tighter">
            Updating Registry...
          </p>
        </div>
      )}

      <CardHeader className="bg-slate-50 p-6 border-b">
        <div className="flex justify-between items-center text-[10px] font-black uppercase">
          <Badge className="bg-slate-900">
            {currentAssessment.module?.code || "REGISTRY"}
          </Badge>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3 w-3" /> Deadline:{" "}
            {new Date(currentAssessment.deadline).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="mt-2 text-xl font-black">
          {currentAssessment.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {isError && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-[10px] flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Connection Lost. Retrying
            sync...
          </div>
        )}

        <select
          className="w-full p-4 bg-slate-50 border-2 rounded-2xl text-xs font-bold outline-none cursor-pointer focus:ring-2 ring-slate-100"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">-- Select Student Registry --</option>
          {students?.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.fullName} ({s.studentId})
            </option>
          ))}
        </select>

        {selectedStudentId && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Edge Case: Late Detection */}
            {studentData?.isLate && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase">
                <AlertCircle className="h-4 w-4 animate-pulse" /> Late
                Submission Detected
              </div>
            )}

            {/* Official Grade Visualization */}
            {studentData?.grade ? (
              <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-10">
                  <CheckCircle2 className="h-20 w-20" />
                </div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                  Registry Grade
                </p>
                <div className="flex justify-between items-end">
                  <h1 className="text-6xl font-black tracking-tighter">
                    {studentData.grade.score}%
                  </h1>
                  <Badge
                    className={`${studentData.status?.color} text-white font-black uppercase px-3 py-1`}
                  >
                    {studentData.status?.label}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl text-amber-600 text-[10px] font-black uppercase text-center flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" /> Awaiting Registry Marking
              </div>
            )}

            {/* File Access Section */}
            {studentData?.submission ? (
              <div className="p-4 bg-slate-50 border-2 border-dashed rounded-2xl flex items-center justify-between transition-all hover:border-blue-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="overflow-hidden text-left">
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Latest Submission
                    </p>
                    <p className="text-[11px] font-bold truncate text-slate-700">
                      {studentData.submission.fileName}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    window.open(studentData.submission.fileUrl, "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            ) : (
              <div className="text-[10px] font-bold text-center text-slate-400 uppercase p-4 border border-slate-100 rounded-2xl border-dashed italic">
                No script in vault
              </div>
            )}

            {/* STAFF WORKFLOW: Grading Panel */}
            {isStaff && (
              <div className="p-5 border-2 border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Admin Grading
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="rounded-xl font-bold h-12 text-lg focus:ring-slate-900"
                    placeholder="Score"
                    min={0}
                    max={100}
                  />
                  <Button
                    onClick={() => gradingMutation.mutate(Number(scoreInput))}
                    className="bg-slate-900 rounded-xl h-12 px-6 hover:bg-black"
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STUDENT WORKFLOW: Advanced Resubmission Control */}
            {isStudent && (
              <div className="pt-2">
                {!studentData?.canSubmit ? (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-[10px] font-black uppercase text-center flex items-center justify-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Portal Closed: Deadline
                    Passed
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadMutation.isPending}
                      className={cn(
                        "w-full h-14 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all font-black uppercase text-[10px]",
                        studentData?.submission
                          ? "border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100"
                          : "border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900",
                      )}
                    >
                      {uploadMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                      {studentData?.submission
                        ? "Resubmit Revised Work"
                        : "Upload Final Script"}
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      accept=".pdf,.docx"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        uploadMutation.mutate(e.target.files[0])
                      }
                    />
                    <p className="text-[8px] text-center text-slate-400 uppercase mt-2">
                      Allowed: PDF, DOCX (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
