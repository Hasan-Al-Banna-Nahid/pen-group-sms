import Link from "next/link";
import {
  Users,
  CreditCard,
  FileText,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] px-6 py-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Registry Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            PEN Global Student Management System — Registry Module
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Student Enrolment */}
          <Link href="/students">
            <div className="group border rounded-2xl p-6 bg-white hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <Users className="h-6 w-6 text-blue-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>

              <h2 className="text-xl font-semibold mt-4">Student Enrolment</h2>
              <p className="text-sm text-gray-500 mt-2">
                Create and manage student records, assign Student IDs, and track
                status.
              </p>
            </div>
          </Link>

          {/* 2. Fees & Payments */}
          <Link href="/fees">
            <div className="group border rounded-2xl p-6 bg-white hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <CreditCard className="h-6 w-6 text-green-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>

              <h2 className="text-xl font-semibold mt-4">Fees & Payments</h2>
              <p className="text-sm text-gray-500 mt-2">
                Track tuition fees, record payments, and monitor outstanding
                balances.
              </p>
            </div>
          </Link>

          {/* 3. Assessments */}
          <Link href="/assessments">
            <div className="group border rounded-2xl p-6 bg-white hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-orange-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>

              <h2 className="text-xl font-semibold mt-4">
                Assessment Submissions
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Manage assignments, submissions, deadlines, and late flags.
              </p>
            </div>
          </Link>

          {/* 4. Results */}
          <Link href="/results">
            <div className="group border rounded-2xl p-6 bg-white hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>

              <h2 className="text-xl font-semibold mt-4">
                Marksheet & Results
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter grades, publish results, and classify performance (Pass,
                Merit, Distinction).
              </p>
            </div>
          </Link>
        </div>

        {/* Footer hint */}
        <div className="mt-12 text-sm text-gray-400">
          Staff view enabled — Student view toggle required in assessment.
        </div>
      </div>
    </div>
  );
}
