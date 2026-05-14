"use client";

import { useStudents } from "@/app/hooks/use-students";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RecordPaymentDialog } from "./record-payment-dialog";
import { cn } from "@/lib/utils";

export function LedgerTable() {
  const { data: students, isLoading } = useStudents();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-semibold">Student</TableHead>
            <TableHead className="font-semibold">Programme</TableHead>
            <TableHead className="font-semibold">Total Fee</TableHead>
            <TableHead className="font-semibold">Paid</TableHead>
            <TableHead className="font-semibold">Balance</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student: any) => {
            const paid = student.totalFees - student.balance;
            const isSettled = student.balance <= 0;
            const isOverdue = student.isCriticalOverdue || student.isOverdue;

            return (
              <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">{student.fullName}</p>
                    <p className="text-xs text-slate-500">{student.studentId}</p>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{student.programme}</TableCell>
                <TableCell className="font-medium">${student.totalFees.toFixed(2)}</TableCell>
                <TableCell className="text-emerald-600 font-medium">${paid.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={cn(
                    "font-bold",
                    isSettled ? "text-slate-400" : isOverdue ? "text-rose-600" : "text-blue-600"
                  )}>
                    ${student.balance.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={isSettled ? "outline" : isOverdue ? "destructive" : "secondary"}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      isSettled && "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {isSettled ? "SETTLED" : isOverdue ? "CRITICAL" : "OUTSTANDING"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RecordPaymentDialog student={student} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
