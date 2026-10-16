import type { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`ta-fade rounded-2xl bg-slate-900/80 border border-white/10 text-white p-5 shadow-xl backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export function LightCard({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`ta-fade rounded-2xl bg-slate-100 text-slate-900 p-5 shadow-xl border border-slate-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function Bubble({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`ta-fade bg-slate-100 text-slate-900 rounded-2xl rounded-bl-none px-4 py-3 text-[16px] sm:text-[17px] leading-relaxed max-w-[85%] shadow-lg border border-slate-200 ${className}`}
    >
      {children}
    </div>
  );
}
