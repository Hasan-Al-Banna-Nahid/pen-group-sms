"use client";

import React, { createContext, useContext, useState } from "react";

type Role = "STAFF" | "STUDENT";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("STAFF"); // Default role is STAFF [cite: 38]

  const toggleRole = () => {
    setRole((prev) => (prev === "STAFF" ? "STUDENT" : "STAFF"));
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within a RoleProvider");
  return context;
};
