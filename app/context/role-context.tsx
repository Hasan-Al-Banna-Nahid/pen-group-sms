"use client";

import React, { createContext, useContext, useState } from "react";

type Role = "STAFF" | "STUDENT";

interface RoleContextType {
  role: Role;
  isLoading: boolean; // Added isLoading type to the context contract
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("STAFF");
  // 1. New loading state to capture role switching transitions globally
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleRole = () => {
    // Engages full-screen global loader immediately upon user click
    setIsLoading(true);

    // Simulated short delay to allow Next.js app router trees to clean up and remount components safely
    setTimeout(() => {
      setRole((prev) => (prev === "STAFF" ? "STUDENT" : "STAFF"));
      setIsLoading(false);
    }, 400); // 400ms is optimal for a smooth fade-in/fade-out loader transition
  };

  return (
    // 2. Bound the new isLoading reactive token into the provider instance value
    <RoleContext.Provider value={{ role, isLoading, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within a RoleProvider");
  return context;
};
