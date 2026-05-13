"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, GraduationCap, CreditCard } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Registry", href: "/registry", icon: Users },
  { name: "Assessments", href: "/assessments", icon: GraduationCap },
  { name: "Fees", href: "/fees", icon: CreditCard },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl rounded-full px-3 py-2 transition-all duration-300 hover:bg-white/80">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-black text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}