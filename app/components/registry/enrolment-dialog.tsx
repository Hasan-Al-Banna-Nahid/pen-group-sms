"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { useQuery } from "@tanstack/react-query";

import { enrolmentSchema } from "@/lib/validations/student";

import { useEnrolStudent } from "@/app/hooks/use-students";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";

import { Plus } from "lucide-react";

type FormValues = z.infer<typeof enrolmentSchema>;

export function EnrolmentDialog() {
  const { mutate, isPending } = useEnrolStudent();

  // FETCH PROGRAMMES
  const { data: programmes } = useQuery({
    queryKey: ["programmes"],

    queryFn: async () => {
      const res = await fetch("/api/programmes");

      if (!res.ok) {
        throw new Error("Failed to fetch programmes");
      }

      return res.json();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(enrolmentSchema),

    defaultValues: {
      fullName: "",
      email: "",
      dob: "",
      programmeId: "",
      academicYear: "2026",
      feeAmount: 0,
      status: "ENROLLED",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Student enrolled successfully");

        reset();
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to enrol student");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2">
          <Plus className="h-4 w-4" />
          Enroll Student
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            New Student Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          {/* FULL NAME */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>

            <Input placeholder="Hasan Al Banna" {...register("fullName")} />

            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>

            <Input
              type="email"
              placeholder="nahid@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Date of Birth</label>

            <Input type="date" {...register("dob")} />

            {errors.dob && (
              <p className="text-sm text-red-500">
                {errors.dob.message?.toString()}
              </p>
            )}
          </div>

          {/* PROGRAMME */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Programme</label>

            <select
              {...register("programmeId")}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="">Select Programme</option>

              {programmes?.map((programme: any) => (
                <option key={programme.id} value={programme.id}>
                  {programme.name}
                </option>
              ))}
            </select>

            {errors.programmeId && (
              <p className="text-sm text-red-500">
                {errors.programmeId.message}
              </p>
            )}
          </div>

          {/* ACADEMIC YEAR */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Academic Year</label>

            <Input {...register("academicYear")} />

            {errors.academicYear && (
              <p className="text-sm text-red-500">
                {errors.academicYear.message}
              </p>
            )}
          </div>

          {/* FEE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Fee Amount</label>

              <Input
                type="number"
                placeholder="10000"
                {...register("feeAmount", {
                  valueAsNumber: true,
                })}
              />

              {errors.feeAmount && (
                <p className="text-sm text-red-500">{errors.feeAmount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Fee Due Date</label>

              <Input type="date" {...register("feeDueDate")} />

              {errors.feeDueDate && (
                <p className="text-sm text-red-500">
                  {errors.feeDueDate.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Enrolment Status</label>

            <select
              {...register("status")}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="ENROLLED">Enrolled</option>

              <option value="DEFERRED">Deferred</option>

              <option value="WITHDRAWN">Withdrawn</option>

              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full h-11" disabled={isPending}>
            {isPending ? "Saving..." : "Confirm Enrolment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
