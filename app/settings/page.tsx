"use client";

import { useRole } from "@/app/context/role-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, ShieldCheck, User, Database } from "lucide-react";

export default function SettingsPage() {
  const { role, toggleRole } = useRole();

  return (
    <div className="container mx-auto py-10 pt-24 max-w-4xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-slate-900" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-slate-500">Manage global configurations and simulate environment variables.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Role Gating Simulation
                </CardTitle>
                <CardDescription>
                  Switch between Staff and Student views to test permissions and UI masking.
                </CardDescription>
              </div>
              <Badge variant={role === "STAFF" ? "default" : "secondary"} className="px-3 py-1">
                {role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${role === "STAFF" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                  {role === "STAFF" ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Current active role: {role}</p>
                  <p className="text-sm text-slate-500">
                    {role === "STAFF" 
                      ? "Full administrative access to registry, payments, and results." 
                      : "Limited access to personal data and student-specific interfaces."}
                  </p>
                </div>
              </div>
              <Button 
                onClick={toggleRole}
                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-200"
              >
                Switch to {role === "STAFF" ? "Student" : "Staff"} View
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                Data Management
              </CardTitle>
              <CardDescription>
                Control the system database state and seed data.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-slate-200">
              <div className="space-y-1">
                <p className="font-medium text-slate-900">Database Seeding</p>
                <p className="text-sm text-slate-500 text-balance">
                  Populate the database with sample students, programmes, and assessments.
                </p>
              </div>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                Trigger Seed
              </Button>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider">System Status</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Environment</p>
                  <p className="text-sm font-medium">Development</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Prisma Client</p>
                  <p className="text-sm font-medium text-emerald-600">Connected</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">App Router</p>
                  <p className="text-sm font-medium">v14.2.3</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Registry Sync</p>
                  <p className="text-sm font-medium text-blue-600">Real-time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
