// src/components/dashboard/StatCard.tsx
import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  Icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  iconColorClass: string;
  valueColorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  Icon,
  title,
  value,
  change,
  iconColorClass,
  valueColorClass,
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-stone-500 text-sm">{title}</p>
        <Icon className={`w-8 h-8 ${iconColorClass}`} />
      </div>
      <p className={`text-3xl font-bold ${valueColorClass}`}>{value}</p>
      <div className="mt-2 text-sm text-emerald-600 font-medium">{change}</div>
    </div>
  );
};
