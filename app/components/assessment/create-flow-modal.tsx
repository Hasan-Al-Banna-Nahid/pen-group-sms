"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

import {
  ArrowRight,
  CheckCircle,
  Plus,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

export function CreateAssessmentFlow() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const [moduleForm, setModuleForm] = useState({
    code: "",
    name: "",
    credits: "15",
  });

  const [assessmentForm, setAssessmentForm] = useState({
    title: "",
    maxMarks: "100",
    weightage: "20",
    deadline: "",
  });

  const [moduleId, setModuleId] = useState("");

  const handleStepChange = (nextStep: number) => {
    setIsAnimating(true);

    setTimeout(() => {
      setStep(nextStep);
      setIsAnimating(false);
    }, 300);
  };

  const createModule = useMutation({
    mutationFn: async (data: typeof moduleForm) => {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          credits: parseInt(data.credits),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create module");
      }

      return res.json();
    },

    onSuccess: (data) => {
      setModuleId(data.id);

      toast.success("Module created successfully");

      handleStepChange(2);
    },

    onError: () => {
      toast.error("Failed to create module");
    },
  });

  const createAssessment = useMutation({
    mutationFn: async (data: typeof assessmentForm) => {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          moduleId,
          maxMarks: parseInt(data.maxMarks),
          weightage: parseInt(data.weightage),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create assessment");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assessments"],
      });

      toast.success("Assessment published successfully");

      setOpen(false);
      setStep(1);

      setModuleForm({
        code: "",
        name: "",
        credits: "15",
      });

      setAssessmentForm({
        title: "",
        maxMarks: "100",
        weightage: "20",
        deadline: "",
      });
    },

    onError: () => {
      toast.error("Failed to create assessment");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
          <Plus className="w-4 h-4" />
          Create Assessment Unit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <div
          className={`transition-all duration-300 transform ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {step === 1 ? (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <BookOpen className="w-5 h-5" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Step 01: Setup Module
                  </span>
                </div>

                <DialogTitle className="text-2xl font-bold">
                  What module is this for?
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Module Code */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Module Code
                  </label>

                  <Input
                    placeholder="COMP101"
                    value={moduleForm.code}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        code: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Module Name */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Module Name
                  </label>

                  <Input
                    placeholder="Introduction to Computing"
                    value={moduleForm.name}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Credits */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Credits
                  </label>

                  <Input
                    type="number"
                    placeholder="15"
                    value={moduleForm.credits}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        credits: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  onClick={() => createModule.mutate(moduleForm)}
                  disabled={createModule.isPending}
                >
                  Next: Setup Assessment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <ClipboardCheck className="w-5 h-5" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Step 02: Setup Assessment
                  </span>
                </div>

                <DialogTitle className="text-2xl font-bold">
                  Now, define the task
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Linked Module */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                  <span className="text-xs font-medium">Linked Module</span>

                  <span className="text-xs font-bold text-blue-600">
                    {moduleForm.code}
                  </span>
                </div>

                {/* Assessment Title */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Assessment Title
                  </label>

                  <Input
                    placeholder="Midterm Coursework"
                    value={assessmentForm.title}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Marks + Weightage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Max Marks
                    </label>

                    <Input
                      type="number"
                      placeholder="100"
                      value={assessmentForm.maxMarks}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          maxMarks: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Weightage %
                    </label>

                    <Input
                      type="number"
                      placeholder="20"
                      value={assessmentForm.weightage}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          weightage: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Submission Deadline
                  </label>

                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={assessmentForm.deadline}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        deadline: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                  onClick={() => createAssessment.mutate(assessmentForm)}
                  disabled={createAssessment.isPending}
                >
                  <CheckCircle className="mr-2 w-4 h-4" />
                  Finish and Publish
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
