"use client";

import { useRole } from "@/app/context/role-context";
import { LedgerTable } from "@/app/components/payment/ledger-table";
import { useStudents } from "@/app/hooks/use-students";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Receipt, History, Info } from "lucide-react";
import { RecordPaymentDialog } from "@/app/components/payment/record-payment-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsPage() {
  const { role } = useRole();
  const { data: students, isLoading } = useStudents();

  // For simulation, we'll pick the first student as the "Current Student"
  const currentStudent = students?.[0];

  if (role === "STAFF") {
    return (
      <div className="container mx-auto py-10 pt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Ledger</h1>
            <p className="text-slate-500">Monitor student accounts, fees, and real-time payment status.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
             <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-tight">
               Live Sync Active
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Outstanding</CardTitle>
              <Wallet className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${students?.reduce((sum: number, s: any) => sum + s.balance, 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">Across {students?.length} enrolled students</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
              <Receipt className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${students?.reduce((sum: number, s: any) => sum + (s.totalFees - s.balance), 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">Confirmed payments received</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Settled Accounts</CardTitle>
              <History className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {students?.filter((s: any) => s.balance <= 0).length} / {students?.length}
              </div>
              <p className="text-xs text-slate-400 mt-1">Students with zero balance</p>
            </CardContent>
          </Card>
        </div>

        <LedgerTable />
      </div>
    );
  }

  // Student View
  return (
    <div className="container mx-auto py-10 pt-24 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Tuition & Fees</h1>
        <p className="text-slate-500">View your current balance and make payments to settle your account.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      ) : currentStudent ? (
        <div className="grid gap-6">
          <Card className="border-slate-200 shadow-md overflow-hidden bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="border-b border-slate-100 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Current Account Balance</CardTitle>
                  <CardDescription>
                    {currentStudent.programme} - {currentStudent.academicYear}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    ${currentStudent.balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">Remaining to pay</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Programme Fee</p>
                  <p className="text-xl font-bold text-slate-900">${currentStudent.totalFees.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Paid to Date</p>
                  <p className="text-xl font-bold text-emerald-600">${(currentStudent.totalFees - currentStudent.balance).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Financial Status</p>
                  <p className={currentStudent.balance <= 0 ? "text-xl font-bold text-blue-600" : "text-xl font-bold text-rose-600"}>
                    {currentStudent.balance <= 0 ? "SETTLED" : currentStudent.isCriticalOverdue ? "OVERDUE" : "OUTSTANDING"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Make a Payment</p>
                    <p className="text-white/60 text-sm">Instant update to your student record</p>
                  </div>
                </div>
                <RecordPaymentDialog student={currentStudent} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
               <Info className="h-4 w-4 text-blue-500" />
               <CardTitle className="text-lg">Payment Policy</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-slate-600 leading-relaxed">
                 All tuition fees must be settled in full to access final marks and certification. 
                 Accounts with a status of <span className="font-bold text-rose-600">CRITICAL OVERDUE</span> will have their results masked automatically 
                 until the balance is cleared. Payments are processed in real-time.
               </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-slate-500">No student record found for your account.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
