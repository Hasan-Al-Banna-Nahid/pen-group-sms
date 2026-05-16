"use client";

import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>

        <div className="absolute h-12 w-12 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-4 border-t-pink-500 border-r-transparent border-b-cyan-400 border-l-transparent"></div>

        <div className="absolute h-4 w-4 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
      </div>

      <div className="mt-8 flex flex-col items-center space-y-2 text-center">
        <h2 className="text-lg font-semibold tracking-widest text-slate-200 uppercase animate-pulse">
          Loading System
        </h2>
        <p className="text-xs text-slate-400 font-medium tracking-wide max-w-[250px]">
          Synchronizing records with secure ledger, please wait...
        </p>
      </div>

      <div className="absolute bottom-10 w-48 h-1 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[loading-bar_2s_ease-in-out_infinite] origin-left"></div>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%) scaleX(0.2);
          }
          50% {
            transform: translateX(0%) scaleX(0.5);
          }
          100% {
            transform: translateX(100%) scaleX(0.2);
          }
        }
      `}</style>
    </div>
  );
}
