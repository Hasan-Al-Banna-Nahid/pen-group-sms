"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRole } from "@/app/context/role-context";
import { User, CreditCard, Info, CheckCircle2 } from "lucide-react";

export function StudentActionModal({
  student: initialStudent,
  isOpen,
  onClose,
}: any) {
  const { role } = useRole();
  const queryClient = useQueryClient();
  const [paymentAmount, setPaymentAmount] = useState("");

  /**
   * Local state to handle real-time UI updates within the modal
   * after a successful transaction.
   */
  const [student, setStudent] = useState(initialStudent);

  // Sync local state when a new student is selected or modal reopens
  useEffect(() => {
    setStudent(initialStudent);
  }, [initialStudent, isOpen]);

  /**
   * Financial logic to calculate current outstanding balance.
   * Ensures data integrity by preventing negative balance displays.
   */
  const totalPaid =
    student?.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const rawBalance = (student?.feeAmount || 0) - totalPaid;
  const displayBalance = rawBalance < 0 ? 0 : rawBalance;
  const isOverdue = rawBalance > 0;

  const { mutate: pay, isPending } = useMutation({
    mutationFn: async (amount: number) => {
      /**
       * Business Rule: Block over-payments at the client level
       * to maintain accounting accuracy.
       */
      if (amount > rawBalance) {
        throw new Error(
          `Transaction Blocked: Amount exceeds outstanding balance (£${rawBalance}).`,
        );
      }

      const res = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          studentId: student.id,
          amount,
          reference: `REG-${student.studentId}`,
        }),
      });
      if (!res.ok) throw new Error("Payment synchronization failed.");
      return res.json();
    },
    onSuccess: (newPayment) => {
      // Update local state for immediate feedback
      setStudent((prev: any) => ({
        ...prev,
        payments: [...(prev.payments || []), newPayment],
      }));

      // Invalidate global student queries to refresh the background list
      queryClient.invalidateQueries({ queryKey: ["students"] });

      toast.success(`Transaction successful for ${student.fullName}`);
      setPaymentAmount("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handlePaymentSubmit = () => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid numeric amount.");
      return;
    }
    pay(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <User className="h-5 w-5 text-blue-600" />
            Student Record: {student?.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Financial Summary Dashboard */}
          <div
            className={`relative p-6 rounded-2xl border transition-all duration-500 ease-in-out ${
              isOverdue
                ? "bg-red-50 border-red-100 shadow-sm"
                : "bg-green-50 border-green-100 shadow-sm"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  Total Fees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  £{student?.feeAmount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  Outstanding
                </p>
                <p
                  className={`text-2xl font-black transition-colors duration-500 ${
                    isOverdue ? "text-red-600" : "text-green-600"
                  }`}
                >
                  £{displayBalance}
                </p>
              </div>
            </div>
            {isOverdue ? (
              <div className="mt-3 flex items-center gap-1.5 text-[10px] bg-red-600 text-white w-fit px-2 py-0.5 rounded-full font-bold animate-pulse">
                STATUS: OVERDUE
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-1 text-[10px] bg-green-600 text-white w-fit px-2 py-0.5 rounded-full font-bold">
                <CheckCircle2 className="h-3 w-3" /> ACCOUNT SETTLED
              </div>
            )}
          </div>

          {/* Role-Based Interface Control */}
          {role === "STAFF" ? (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Process Payment
                </h4>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-tight">
                  Ref ID: {student?.studentId}
                </span>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  disabled={!isOverdue || isPending}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isPending || !isOverdue || !paymentAmount}
                  className="bg-blue-600 hover:bg-blue-700 min-w-[140px] shadow-sm active:scale-95 transition-all"
                >
                  {isPending
                    ? "Syncing..."
                    : `Pay for ${student?.fullName?.split(" ")[0]}`}
                </Button>
              </div>

              {!isOverdue ? (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-100/50 p-3 rounded-lg border border-green-200 animate-in fade-in slide-in-from-top-1">
                  <Info className="h-4 w-4 shrink-0" />
                  This account is fully settled. Additional payments are
                  restricted.
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">
                  Note: The system validates transactions against the balance in
                  real-time.
                </p>
              )}
            </div>
          ) : (
            /* Student View: Authorized Read-Only Access */
            <div className="p-5 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-200 flex gap-3 shadow-inner">
              <Info className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold mb-1">Financial Status: Read-Only</p>
                <p className="leading-relaxed opacity-90">
                  Your current balance is <strong>£{displayBalance}</strong>. To
                  finalize pending payments, please contact the Registry
                  department with reference ID:{" "}
                  <span className="font-mono font-bold">
                    {student?.studentId}
                  </span>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Academic & Enrolment Data */}
          <div className="grid grid-cols-2 gap-y-3 text-[13px] border-t pt-5 px-1 bg-gray-50/50 rounded-b-xl -mx-6 px-6 pb-2">
            <span className="text-gray-500">Academic Programme</span>
            <span className="font-semibold text-right text-gray-800">
              {student?.programme}
            </span>
            <span className="text-gray-500">Academic Year</span>
            <span className="font-semibold text-right text-gray-800">
              {student?.academicYear || "2025/26"}
            </span>
            <span className="text-gray-500">Registry Status</span>
            <span className="text-right">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border border-blue-200">
                {student?.status}
              </span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
