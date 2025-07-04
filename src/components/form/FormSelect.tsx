import React, { type FC, type SelectHTMLAttributes } from "react";

const FormSelect: FC<SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <div className="relative">
    <select
      {...props}
      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none"
    />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
        className="h-5 w-5"
      >
        <path
          stroke="#9ca3af"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M6 8l4 4 4-4"
        />
      </svg>
    </div>
  </div>
);

export default FormSelect;
