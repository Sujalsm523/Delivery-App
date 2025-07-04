// src/components/dashboard/MonthlyImpact.tsx
import React from "react";
import { Leaf } from "lucide-react";
import type { EnvironmentalDataPoint } from "../../types";

interface MonthlyImpactProps {
  data: EnvironmentalDataPoint[];
}

export const MonthlyImpact: React.FC<MonthlyImpactProps> = ({ data }) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center text-stone-800">
        <Leaf className="w-6 h-6 mr-3 text-emerald-500" />
        Monthly Impact
      </h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-stone-600">
                {item.name}
              </span>
              <span className="text-sm font-bold" style={{ color: item.color }}>
                {item.value}%
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{ width: `${item.value}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
