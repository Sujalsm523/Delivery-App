import React, { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={`bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6 ${className}`}
  >
    {children}
  </div>
);

export default Card;
