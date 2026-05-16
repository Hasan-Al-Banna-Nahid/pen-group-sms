"use client";

import { useState } from "react";
import { useRecordPayment } from "@/app/hooks/use-payments";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { useRole } from "@/app/context/role-context";

import { Badge } from "@/components/ui/badge";

interface RecordPaymentDialogProps {
  student: {
    id: string;
    fullName: string;
    studentId: string;
    balance: number;
    financialStatus: string;
    totalFees?: number;
    totalPaid?: number;
  };
  trigger?: React.ReactNode;
}

export function RecordPaymentDialog({ student, trigger }: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [open, setOpen] = useState(false);
  const { role } = useRole();
  const recordPayment = useRecordPayment();

  // STRICTOR SETTLED LOGIC: Derived from balance or explicit status
  const isSettled = student.balance <= 0 || student.financialStatus === "SETTLED";

  const handleRecord = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      await recordPayment.mutateAsync({
        studentId: student.id,
        amount: parseFloat(amount),
        reference: reference || (role === "STAFF" ? "STAFF-RECORD" : "STUDENT-PAY"),
      });
      setOpen(false);
      setAmount("");
      setReference("");
    } catch (error) {
      console.error(error);
    }
  };

  if (isSettled && !trigger) {
    return (
      <Badge variant="outline" className="h-10 px-4 py-2 border-emerald-200 bg-emerald-50 text-emerald-700 gap-2 font-medium">
        <CheckCircle2 className="h-4 w-4" />
        Account Settled
      </Badge>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {role === "STAFF" ? "Record Payment" : "Pay Now"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Enter payment details for {student.fullName} ({student.studentId}).
            Current Balance: <span className="font-bold text-slate-900">${student.balance.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={student.balance}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reference">Reference / Receipt No.</Label>
            <Input
              id="reference"
              placeholder={role === "STAFF" ? "e.g. CASH-123" : "Transaction Ref"}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleRecord} 
            disabled={recordPayment.isPending || !amount || parseFloat(amount) <= 0}
            className="w-full bg-slate-900"
          >
            {recordPayment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
