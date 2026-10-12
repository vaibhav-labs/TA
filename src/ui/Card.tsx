import type { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`ta-fade bg-ta-white text-ta-black rounded-xl p-4 ${className}`}>{children}</div>
  );
}

export function Bubble({ children }: PropsWithChildren) {
  return (
    <div className="ta-fade bg-ta-white text-ta-black rounded-xl rounded-bl-sm px-4 py-3 text-[17px] leading-6 max-w-[85%]">
      {children}
    </div>
  );
}
