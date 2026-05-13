"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
      programme: "",
      academicYear: "2025/26",
      feeAmount: 0,
    },
  });

  function onSubmit(values: FormValues) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Enrolment successful!");
        reset();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong");
      },
    });
  }

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
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input placeholder="Hasan Al Banna" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-red-500">
                {errors.fullName.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              placeholder="nahid@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <Input type="date" {...register("dob")} />
            {errors.dob && (
              <p className="text-sm text-red-500">
                {errors.dob.message as string}
              </p>
            )}
          </div>

          {/* Programme */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Programme
            </label>
            <Input placeholder="BSc CSE" {...register("programme")} />
            {errors.programme && (
              <p className="text-sm text-red-500">
                {errors.programme.message as string}
              </p>
            )}
          </div>

          {/* Academic Year */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <Input {...register("academicYear")} />
            {errors.academicYear && (
              <p className="text-sm text-red-500">
                {errors.academicYear.message as string}
              </p>
            )}
          </div>

          {/* Fee Amount */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Fee Amount
            </label>
            <Input
              type="number"
              placeholder="10000"
              {...register("feeAmount", { valueAsNumber: true })}
            />
            {errors.feeAmount && (
              <p className="text-sm text-red-500">
                {errors.feeAmount.message as string}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-11" disabled={isPending}>
            {isPending ? "Saving..." : "Confirm Enrolment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
