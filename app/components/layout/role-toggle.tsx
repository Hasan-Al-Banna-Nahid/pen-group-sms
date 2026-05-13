"use client";

import { useRole } from "@/app/context/role-context";
import { Button } from "@/components/ui/button";
import { UserCog, GraduationCap } from "lucide-react";

export function RoleToggle() {
  const { role, toggleRole } = useRole();

  return (
    <div className="fixed bottom-10 right-10 z-[9999]">
      {" "}
      {/* Higher z-index for visibility */}
      <Button
        onClick={toggleRole}
        className={`rounded-full shadow-2xl h-14 px-6 gap-2 text-white transition-all ${
          role === "STAFF"
            ? "bg-slate-900 hover:bg-slate-800"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {role === "STAFF" ? (
          <>
            <UserCog className="h-5 w-5" /> Switch to Student View
          </>
        ) : (
          <>
            <GraduationCap className="h-5 w-5" /> Switch to Staff View
          </>
        )}
      </Button>
    </div>
  );
}
