// src/components/tracking/VehicleStatusCard.tsx
import React from "react";
import { Truck } from "lucide-react";
import { type Vehicle } from "../../types";
import { getVehicleStatusStyling } from "../../lib/utils";

interface VehicleStatusCardProps {
  vehicle: Vehicle;
}

export const VehicleStatusCard: React.FC<VehicleStatusCardProps> = ({
  vehicle,
}) => {
  const statusStyling = getVehicleStatusStyling(vehicle.status);
  const progressColor =
    vehicle.status === "completed"
      ? "bg-emerald-500"
      : vehicle.status === "on-time"
      ? "bg-sky-500"
      : "bg-rose-500";

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusStyling.bg}`}>
            <Truck className={`w-5 h-5 ${statusStyling.text}`} />
          </div>
          <div>
            <h4 className="font-semibold text-stone-800">
              Vehicle {vehicle.id}
            </h4>
            <p className="text-sm text-stone-500">{vehicle.location}</p>
          </div>
        </div>
        <span className={`text-xs font-bold ${statusStyling.text}`}>
          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
        </span>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-stone-600">Progress</span>
          <span className="font-medium">{Math.floor(vehicle.progress)}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${progressColor}`}
            style={{ width: `${vehicle.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
