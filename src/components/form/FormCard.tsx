import React, { type FC, type ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

const FormCard: FC<FormCardProps> = ({ children, className }) => (
  <div
    className={`relative w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 ${className}`}
  >
    {children}
  </div>
);

export default FormCard;
