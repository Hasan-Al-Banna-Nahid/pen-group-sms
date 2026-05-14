"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock, GraduationCap, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentMarksheetProps {
  student: any;
  results: any[];
}

export function StudentMarksheet({ student, results }: StudentMarksheetProps) {
  const isOverdue = student.financialStatus === "CRITICAL_OVERDUE" || student.isCriticalOverdue;

  return (
    <div className="space-y-8">
      {isOverdue && (
        <Alert variant="destructive" className="border-2 border-rose-500 bg-rose-50 animate-pulse shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle className="text-lg font-bold">Results Withheld</AlertTitle>
            <AlertDescription className="text-rose-700 font-medium">
              Your academic performance is currently masked due to an outstanding balance of 
              <span className="font-bold"> ${student.balance.toFixed(2)}</span>. 
              Please settle your account in the Payments tab to unlock your marks.
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result: any) => {
          const isMasked = isOverdue || !result.isPublished;
          
          return (
            <Card key={result.id} className={cn(
              "overflow-hidden transition-all duration-300 border-slate-200",
              isMasked ? "bg-slate-50/50 grayscale-[0.5]" : "hover:shadow-md hover:border-blue-200 bg-white"
            )}>
              <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/30">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{result.assessment.module.code}</p>
                     <CardTitle className="text-base font-bold text-slate-800 line-clamp-1">{result.assessment.title}</CardTitle>
                   </div>
                   {result.isPublished ? (
                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   ) : (
                     <Lock className="h-4 w-4 text-slate-300" />
                   )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-4 relative">
                  {isMasked ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-slate-200 rounded-full">
                         <Lock className="h-6 w-6 text-slate-500" />
                      </div>
                      <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        {isOverdue ? "Financial Hold" : "Awaiting Publication"}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className={cn(
                        "text-5xl font-black tracking-tighter mb-2",
                        result.classification === 'FAIL' ? "text-rose-500" : "text-slate-900"
                      )}>
                        {result.score}%
                      </p>
                      <Badge variant={result.classification === 'FAIL' ? "destructive" : "secondary"} className="px-3">
                        {result.classification}
                      </Badge>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-4 flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Released: {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {results.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <GraduationCap className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No assessment results recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
