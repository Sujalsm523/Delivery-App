// src/components/tracking/TrackingTab.tsx
import React from "react";
import type { Vehicle, Store, RoutePaths } from "../../types";
import { RouteVisualization } from "./RouteVisualization";
import { VehicleStatusCard } from "./VehicleStatusCard";

interface TrackingTabProps {
  vehicles: Vehicle[];
  stores: Store[];
  routePaths: RoutePaths;
}

export const TrackingTab: React.FC<TrackingTabProps> = ({
  vehicles,
  stores,
  routePaths,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-stone-800">
        Live Vehicle Tracking
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RouteVisualization
            stores={stores}
            vehicles={vehicles}
            routes={routePaths}
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-stone-800">
            Vehicle Status
          </h3>
          {vehicles.map((vehicle) => (
            <VehicleStatusCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
};
