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
import { useRole } from "@/app/context/role-context";
import { cn } from "@/lib/utils";

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

  // FIX: Initialize with "all" instead of "" to prevent Radix UI runtime errors
  const [enrolmentFilter, setEnrolmentFilter] = useState<string>("all");
  const [financialFilter, setFinancialFilter] = useState<string>("all");

  useEffect(() => {
    const fetchStudents = async () => {
      const queryParams = new URLSearchParams();

      // Add search term if exists
      if (searchTerm) queryParams.append("query", searchTerm);

      // FIX: Only append to URL if the value is not "all"
      if (enrolmentFilter !== "all") {
        queryParams.append("enrolmentStatus", enrolmentFilter);
      }

      if (financialFilter !== "all") {
        queryParams.append("financialStatus", financialFilter);
      }

      try {
        const response = await fetch(
          `/api/registry/search?${queryParams.toString()}`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data: Student[] = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchStudents();
  }, [searchTerm, enrolmentFilter, financialFilter]);

  // Quick Stats Calculation
  const totalStudents = students.length;
  const totalOutstandingRevenue = students.reduce((sum, student) => {
    return sum + (student.financialStatus !== "SETTLED" ? student.balance : 0);
  }, 0);
  const numberOfWithheldResults = students.reduce(
    (sum, student: any) => sum + (student.withheldCount || 0),
    0,
  );

  // Authorization Check
  if (role !== "STAFF") {
    return (
      <div className="mt-28 flex items-center justify-center h-full text-lg text-gray-500">
        Access Denied: You must be a Staff member to view this page.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Registry Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-sm font-medium text-gray-500">Total Students</h2>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-sm font-medium text-gray-500">
            Outstanding Revenue
          </h2>
          <p className="text-2xl font-bold text-red-600">
            {totalOutstandingRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-sm font-medium text-gray-500">
            Withheld Results
          </h2>
          <p className="text-2xl font-bold">{numberOfWithheldResults}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search name, ID, or programme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        {/* Enrolment Filter */}
        <Select
          value={enrolmentFilter}
          onValueChange={(value) => setEnrolmentFilter(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Enrolment Status" />
          </SelectTrigger>
          <SelectContent>
            {/* FIX: Set value to "all" instead of "" */}
            <SelectItem value="all">All Enrolment Statuses</SelectItem>
            <SelectItem value="ENROLLED">Enrolled</SelectItem>
            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Financial Filter */}
        <Select
          value={financialFilter}
          onValueChange={(value) => setFinancialFilter(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Financial Status" />
          </SelectTrigger>
          <SelectContent>
            {/* FIX: Set value to "all" instead of "" */}
            <SelectItem value="all">All Financial Statuses</SelectItem>
            <SelectItem value="SETTLED">Settled</SelectItem>
            <SelectItem value="OUTSTANDING">Outstanding</SelectItem>
            <SelectItem value="CRITICAL_OVERDUE">Critical Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finance</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.studentId}
                  </TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.programmeName}</TableCell>
                  <TableCell>{student.academicYear}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "ENROLLED" ? "default" : "outline"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          student.financialStatus === "SETTLED"
                            ? "bg-green-500"
                            : student.isCriticalOverdue
                              ? "bg-red-500"
                              : "bg-yellow-500",
                        )}
                      />
                      {student.financialStatus}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {student.balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No records matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
