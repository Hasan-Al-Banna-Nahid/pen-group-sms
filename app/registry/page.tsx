"use client";

import { StudentList } from "@/app/components/registry/student-list";
import { EnrolmentDialog } from "@/app/components/registry/enrolment-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRole } from "@/app/context/role-context";

export default function RegistryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { role } = useRole(); // Get current role

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 md:mt-28">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {role === "STAFF" ? "Student Registry" : "My Academic Record"}
          </h1>
          <p className="text-gray-500 mt-1">
            {role === "STAFF"
              ? "Manage enrolment records and academic status. [cite: 12]"
              : "View your enrolment details and fees. [cite: 20]"}
          </p>
        </div>

        {/* Role-based UI Reflection: Only STAFF can enrol students [cite: 38] */}
        {role === "STAFF" && <EnrolmentDialog />}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search records... [cite: 16]"
          className="pl-10 bg-white border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Pass role to StudentList to filter data if needed */}
        <StudentList searchQuery={searchTerm} role={role} />
      </div>
    </div>
  );
}
