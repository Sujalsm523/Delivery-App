// src/components/dashboard/DashboardTab.tsx
import React from "react";
import { Truck, Zap, TrendingUp, Leaf } from "lucide-react";
import { StatCard } from "./StatCard";
import { InventoryStatus } from "./InventoryStatus";
import { MonthlyImpact } from "./MonthlyImpact";
import type { Vehicle, Store, EnvironmentalDataPoint } from "../../types";

interface DashboardTabProps {
  vehicles: Vehicle[];
  stores: Store[];
  environmentalData: EnvironmentalDataPoint[];
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  vehicles,
  stores,
  environmentalData,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          Icon={Truck}
          title="Active Deliveries"
          value={vehicles.filter((v) => v.progress < 100).length.toString()}
          change="↑ 12% from yesterday"
          iconColorClass="text-sky-400"
          valueColorClass="text-sky-600"
        />
        <StatCard
          Icon={Zap}
          title="Route Efficiency"
          value="94%"
          change="↑ 8% improvement"
          iconColorClass="text-emerald-400"
          valueColorClass="text-emerald-600"
        />
        <StatCard
          Icon={TrendingUp}
          title="Cost Savings"
          value="₹2.3L"
          change="↑ 25% this month"
          iconColorClass="text-amber-400"
          valueColorClass="text-amber-600"
        />
        <StatCard
          Icon={Leaf}
          title="CO₂ Reduced"
          value="1.2T"
          change="↓ 18% emissions"
          iconColorClass="text-teal-400"
          valueColorClass="text-teal-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InventoryStatus stores={stores} />
        <MonthlyImpact data={environmentalData} />
      </div>
    </div>
  );
};
