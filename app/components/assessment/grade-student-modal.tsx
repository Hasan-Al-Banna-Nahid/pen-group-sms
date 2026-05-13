"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function GradeStudent({ submission }: { submission: any }) {
  const [score, setScore] = useState("");

  const submitGrade = async () => {
    const res = await fetch("/api/grades", {
      method: "POST",
      body: JSON.stringify({
        studentId: submission.student.id,
        assessmentId: submission.assessmentId,
        score: score,
      }),
    });

    if (res.ok)
      toast.success(`Graded ${submission.student.fullName} successfully!`);
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-bold text-sm">
          Student: {submission.student.fullName}
        </p>
        <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {submission.student.studentId}
        </p>
      </div>

      {/* PDF Preview Logic */}
      <div className="aspect-video w-full border rounded bg-white overflow-hidden flex items-center justify-center">
        {submission.fileUrl.endsWith(".pdf") ? (
          <iframe
            src={submission.fileUrl}
            className="w-full h-full"
            title="Submission Preview"
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-xs text-muted-foreground">
              DOCX Preview not available. Click to download.
            </p>
            <a
              href={submission.fileUrl}
              className="text-blue-600 underline text-sm"
            >
              Download Document
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Enter Marks"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <Button onClick={submitGrade}>Save Grade</Button>
      </div>
    </div>
  );
}
