"use client";

import { useStudents } from "@/app/hooks/use-students";
import { useAssessments } from "@/app/hooks/use-assessments";
import { useUpsertGrade } from "@/app/hooks/use-grades";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function GradeInputTable() {
  const { data: students } = useStudents();
  const { assessmentsQuery } = useAssessments();
  const upsertGrade = useUpsertGrade();
  const [editingGrade, setEditingGrade] = useState<{sid: string, aid: string, score: string} | null>(null);

  const assessments = assessmentsQuery.data || [];

  const handleSave = async (studentId: string, assessmentId: string, score: string, isPublished?: boolean) => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return;
    
    await upsertGrade.mutateAsync({
      studentId,
      assessmentId,
      score: numScore,
      isPublished
    });
    setEditingGrade(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="min-w-[200px] font-semibold">Student</TableHead>
            {assessments.map((ass: any) => (
              <TableHead key={ass.id} className="min-w-[150px] font-semibold text-center">
                {ass.title}
                <p className="text-[10px] text-slate-400 font-normal uppercase mt-1">{ass.module.code}</p>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student: any) => (
            <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell>
                <div>
                  <p className="font-medium text-slate-900">{student.fullName}</p>
                  <p className="text-xs text-slate-500">{student.studentId}</p>
                  {student.isCriticalOverdue && (
                    <Badge variant="destructive" className="mt-1 text-[8px] h-4">FEES OVERDUE</Badge>
                  )}
                </div>
              </TableCell>
              {assessments.map((ass: any) => {
                const grade = student.grades?.find((g: any) => g.assessmentId === ass.id);
                const isEditing = editingGrade?.sid === student.id && editingGrade?.aid === ass.id;
                
                return (
                  <TableCell key={ass.id} className="text-center group">
                    <div className="flex flex-col items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input 
                            className="w-16 h-8 text-center" 
                            defaultValue={grade?.score || ""}
                            autoFocus
                            onKeyDown={(e) => {
                               if(e.key === 'Enter') handleSave(student.id, ass.id, (e.target as HTMLInputElement).value, grade?.isPublished);
                            }}
                            onBlur={(e) => setEditingGrade(null)}
                          />
                          <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700">
                             <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer hover:bg-slate-100 px-3 py-1 rounded-lg transition-all"
                          onClick={() => setEditingGrade({sid: student.id, aid: ass.id, score: grade?.score?.toString() || ""})}
                        >
                          <p className={cn(
                            "text-lg font-bold",
                            !grade ? "text-slate-200" : grade.classification === 'FAIL' ? "text-rose-500" : "text-slate-900"
                          )}>
                            {grade?.score ?? "--"}
                          </p>
                          {grade && (
                            <div className="flex items-center gap-1 justify-center mt-1">
                               <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-slate-200">
                                 {grade.classification}
                               </Badge>
                               {grade.isPublished ? (
                                 <Eye className="h-3 w-3 text-emerald-500" />
                               ) : (
                                 <EyeOff className="h-3 w-3 text-slate-300" />
                               )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {grade && !isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleSave(student.id, ass.id, grade.score.toString(), !grade.isPublished)}
                        >
                          {grade.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
