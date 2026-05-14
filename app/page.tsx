"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  CreditCard,
  ShieldCheck,
  GraduationCap,
  FileCheck,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Framer Motion staggered child animation parameters
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-blue-500/10 selection:text-blue-600 overflow-x-hidden">
      {/* Background Micro-Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto pt-24 pb-20 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="flex flex-col items-center"
        >
          {/* Animated Enterprise Badge */}
          <motion.div
            variants={fadeInUpVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 border border-blue-100/80 text-blue-600 text-xs font-medium backdrop-blur-sm shadow-sm mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>PEN Global Registry Module V2.0</span>
          </motion.div>

          {/* Core Value Proposition Headline */}
          <motion.h1
            variants={fadeInUpVariants}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl leading-[1.1]"
          >
            A Focused System Built for{" "}
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-blue-600 via-indigo-600 to-purple-600">
              Modern Registrars
            </span>
          </motion.h1>

          {/* Subtext mapping architecture capabilities */}
          <motion.p
            variants={fadeInUpVariants}
            className="text-base md:text-lg text-gray-500 mt-6 max-w-2xl font-normal leading-relaxed"
          >
            An interconnected ecosystem orchestrating automated sequential ID
            generation, real-time ledger settlements, and precise role-gated
            access without client-side page refreshes.
          </motion.p>

          {/* Premium Call to Actions */}
          <motion.div
            variants={fadeInUpVariants}
            className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
          >
            <Link href="/registry" passHref>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 font-medium transition shadow-md hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98]"
              >
                Access Registry Workspace
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </Link>
            <Link href="/settings" passHref>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 bg-white/80 backdrop-blur-sm text-gray-600 border-gray-200 hover:bg-gray-50 font-medium active:scale-[0.98]"
              >
                System Configurations
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Architecture Features Showcase - Bento Grid Style */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1: Automated ID & Enrolment */}
          <motion.div
            variants={fadeInUpVariants}
            className="md:col-span-1 group relative border border-gray-200/60 rounded-3xl p-8 bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Student Enrolment
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Seamless onboarding system that generates safe, sequential
                identifiers based on academic year structures while linking
                programme base fees instantly.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-50 flex items-center text-xs font-mono text-gray-400">
              Format: SMS-2026-XXXX
            </div>
          </motion.div>

          {/* Feature 2: Real-time Account Settlements */}
          <motion.div
            variants={fadeInUpVariants}
            className="md:col-span-2 group relative border border-gray-200/60 rounded-3xl p-8 bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-md">
                <div className="h-10 w-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 mb-6">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Reactive Ledger Operations
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Real-time transactional balance calculation. When a student
                  pays outstanding balances down to zero, the interface
                  instantly shifts status to{" "}
                  <span className="text-green-600 font-medium">SETTLED</span>{" "}
                  and safely gray-blocks further payment triggers.
                </p>
              </div>

              {/* Context Interactive Architecture Visualization Mock */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 font-mono text-[11px] text-gray-600 w-full md:w-56 shadow-inner self-center">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/60">
                  <span className="font-bold text-gray-900">Ledger Record</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Base Fee:</span>
                    <span className="text-gray-900">$4,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="text-gray-900">$4,500.00</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-dashed border-gray-200">
                    <span>Outstanding:</span>
                    <span className="text-green-600">$0.00</span>
                  </div>
                </div>
                <div className="mt-3 text-center px-2 py-1 rounded bg-gray-200 text-gray-400 font-sans text-[10px] font-medium tracking-wide uppercase select-none">
                  Account Settled
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Grade Access & Withheld State Gates */}
          <motion.div
            variants={fadeInUpVariants}
            className="md:col-span-2 group relative border border-gray-200/60 rounded-3xl p-8 bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-md">
                <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Withheld Marksheets
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Advanced business compliance mapping. If a student is flagged
                  with an overdue outstanding financial status, academic grades
                  are automatically masked and locked out on their view with an
                  informative notification alert.
                </p>
              </div>

              {/* Masked grade UI preview */}
              <div className="bg-red-50/40 border border-red-100/60 rounded-2xl p-4 text-center w-full md:w-56 self-center">
                <ShieldCheck className="h-5 w-5 text-red-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                  Academic Lockout
                </span>
                <p className="text-[11px] text-red-500/80 mt-1 leading-snug">
                  Result Withheld due to Outstanding Fees
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 4: Reactive Query Lifecycle */}
          <motion.div
            variants={fadeInUpVariants}
            className="md:col-span-1 group relative border border-gray-200/60 rounded-3xl p-8 bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-6">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Refresh-Free State Sync
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Utilizes precise cache invalidation protocols. Every creation,
                grading, or payment adjustment updates the UI immediately
                without manual page updates.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-50 flex items-center text-xs font-mono text-gray-400 gap-2">
              <Layers className="h-3.5 w-3.5" /> TanStack Query Ecosystem
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Role Separator Context Callout Banner */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative border border-gray-200/60 rounded-3xl p-8 md:p-10 bg-gradient-to-br from-white to-gray-50/50 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Dual Stakeholder Authorization Checks
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
                The layout structure respects the system's active context role.
                Administrators gain access to CRUD mutations while Students
                safely view their personalized records. Toggle roles instantly
                inside the settings workspace.
              </p>
            </div>
          </div>
          <Link href="/settings" passHref>
            <Button
              variant="secondary"
              className="bg-gray-950 text-white hover:bg-gray-800 rounded-full px-6 font-medium shadow transition shrink-0 active:scale-[0.98]"
            >
              Switch View Context
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
