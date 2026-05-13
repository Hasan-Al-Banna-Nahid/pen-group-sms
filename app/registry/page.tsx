"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/app/context/role-context"; // Assuming this context exists

interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  programmeName: string;
  academicYear: string;
  status: "ENROLLED" | "WITHDRAWN" | "COMPLETED";
  financialStatus: "SETTLED" | "OUTSTANDING" | "CRITICAL_OVERDUE";
  isCriticalOverdue: boolean;
  balance: number;
}

export default function RegistryDashboard() {
  const { role } = useRole();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolmentFilter, setEnrolmentFilter] = useState<
    "ENROLLED" | "WITHDRAWN" | "COMPLETED" | ""
  >("");
  const [financialFilter, setFinancialFilter] = useState<
    "SETTLED" | "OUTSTANDING" | "CRITICAL_OVERDUE" | ""
  >("");

  useEffect(() => {
    const fetchStudents = async () => {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("query", searchTerm);
      if (enrolmentFilter) queryParams.append("enrolmentStatus", enrolmentFilter);
      if (financialFilter) queryParams.append("financialStatus", financialFilter);

      const response = await fetch(`/api/registry/search?${queryParams.toString()}`);
      const data: Student[] = await response.json();
      setStudents(data);
    };

    fetchStudents();
  }, [searchTerm, enrolmentFilter, financialFilter]);

  // Quick Stats Calculation
  const totalStudents = students.length;
  const totalOutstandingRevenue = students.reduce((sum, student) => {
    return sum + (student.financialStatus !== "SETTLED" ? student.balance : 0);
  }, 0);
  // Placeholder for Number of Withheld Results (needs API support)
  const numberOfWithheldResults = 0; // This would come from an API if implemented

  if (role !== "STAFF") {
    return (
      <div className="flex items-center justify-center h-full text-lg text-gray-500">
        Access Denied: You must be a Staff member to view this page.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Registry Dashboard</h1>

      {/* Quick Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-2xl">{totalStudents}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Total Outstanding Revenue</h2>
          <p className="text-2xl">
            {totalOutstandingRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Withheld Results</h2>
          <p className="text-2xl">{numberOfWithheldResults}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name, ID, programme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={enrolmentFilter}
          onValueChange={(value: typeof enrolmentFilter) => setEnrolmentFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Enrolment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Enrolment Statuses</SelectItem>
            <SelectItem value="ENROLLED">Enrolled</SelectItem>
            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={financialFilter}
          onValueChange={(value: typeof financialFilter) => setFinancialFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Financial Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Financial Statuses</SelectItem>
            <SelectItem value="SETTLED">Settled</SelectItem>
            <SelectItem value="OUTSTANDING">Outstanding</SelectItem>
            <SelectItem value="CRITICAL_OVERDUE">Critical Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Enrolment Status</TableHead>
              <TableHead>Financial Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.studentId}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.programmeName}</TableCell>
                  <TableCell>{student.academicYear}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "ENROLLED" ? "default" : "outline"}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {student.isCriticalOverdue && (
                        <span className="h-2 w-2 rounded-full bg-red-500" title="Critical Overdue" />
                      )}
                      {student.financialStatus === "OUTSTANDING" && !student.isCriticalOverdue && (
                        <span className="h-2 w-2 rounded-full bg-yellow-500" title="Outstanding" />
                      )}
                      {student.financialStatus === "SETTLED" && (
                        <span className="h-2 w-2 rounded-full bg-green-500" title="Settled" />
                      )}
                      {student.financialStatus}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {student.balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
