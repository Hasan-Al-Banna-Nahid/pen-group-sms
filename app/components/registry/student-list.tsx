"use client";

import { useState } from "react";
import { useStudents } from "@/app/hooks/use-students";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentActionModal } from "./student-action-modal";

/**
 * Updated Props Interface to include role
 */
interface StudentListProps {
  searchQuery: string;
  role: string | null; // Added role property to fix TypeScript error
}

export function StudentList({ searchQuery, role }: StudentListProps) {
  const { data, isLoading, isError } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const students = Array.isArray(data) ? data : [];
  const query = searchQuery?.toLowerCase() || "";

  /**
   * Search filtering logic
   */
  const filteredStudents = students.filter((s: any) => {
    if (!query) return true;
    return (
      (s.fullName || "").toLowerCase().includes(query) ||
      (s.studentId || "").toLowerCase().includes(query) ||
      (s.programme || "").toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center animate-pulse text-gray-400">
        Fetching registry data from database...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-20 text-center text-red-500 font-medium">
        Error: Failed to connect to the database.
      </div>
    );
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow>
            <TableHead className="w-[140px] font-bold">Student ID</TableHead>
            <TableHead className="font-bold">Full Name</TableHead>
            <TableHead className="font-bold">Programme & Year</TableHead>
            <TableHead className="font-bold">Fee Status</TableHead>
            <TableHead className="font-bold">Enrolment</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredStudents.map((student: any) => {
            /**
             * Business Logic: Calculate balance in real-time
             */
            const totalPaid =
              student.payments?.reduce(
                (sum: number, p: any) => sum + p.amount,
                0,
              ) || 0;
            const balance = (student.feeAmount || 0) - totalPaid;
            const isOverdue = balance > 0;

            return (
              <TableRow
                key={student.id}
                className="group hover:bg-blue-50/30 transition-colors"
              >
                <TableCell className="font-mono text-sm font-bold text-blue-600">
                  {student.studentId}
                </TableCell>

                <TableCell>
                  <div className="font-semibold text-gray-900">
                    {student.fullName}
                  </div>
                  <div className="text-xs text-gray-500">{student.email}</div>
                </TableCell>

                <TableCell>
                  <div className="text-sm font-medium text-gray-700">
                    {student.programme}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Term: {student.academicYear || "2025/26"}
                  </div>
                </TableCell>

                <TableCell>
                  {isOverdue ? (
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 flex w-fit gap-1"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                      £{balance} Overdue
                    </Badge>
                  ) : (
                    <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                      Fully Paid
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {student.status.toLowerCase()}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant={role === "STAFF" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                    className={
                      role === "STAFF" ? "bg-blue-600 hover:bg-blue-700" : ""
                    }
                  >
                    {role === "STAFF" ? "Manage Record" : "View Profile"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}

          {filteredStudents.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-gray-400">
                No records found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedStudent && (
        <StudentActionModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
