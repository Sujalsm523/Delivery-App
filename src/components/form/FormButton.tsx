import React, {
  type FC,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const FormButton: FC<FormButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full glow-button bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold text-lg py-3 rounded-xl transition shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export default FormButton;
