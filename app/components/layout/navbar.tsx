"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { useRole } from "@/app/context/role-context";

const navItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard,
    roles: ["STAFF", "STUDENT"] 
  },
  { 
    name: "Registry", 
    href: "/registry", 
    icon: Users,
    roles: ["STAFF"] 
  },
  { 
    name: "Assessments", 
    href: "/assessments", 
    icon: GraduationCap,
    roles: ["STAFF", "STUDENT"] 
  },
  { 
    name: "Payments", 
    href: "/payments", 
    icon: CreditCard,
    roles: ["STAFF", "STUDENT"] 
  },
  { 
    name: "Results", 
    href: "/results", 
    icon: BarChart3,
    roles: ["STAFF", "STUDENT"] 
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    roles: ["STAFF"] 
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { role } = useRole();

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <nav className="flex items-center gap-1 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-full px-2 py-2 transition-all duration-500 hover:bg-white/90">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative group",
                isActive 
                  ? "bg-slate-900 text-white shadow-lg scale-105" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-900"
              )} />
              <span className="hidden md:inline">{item.name}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full md:hidden" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}