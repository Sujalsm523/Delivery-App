// src/components/tracking/RouteVisualization.tsx
import React from "react";
import { Truck } from "lucide-react";
import type { Store, Vehicle, RoutePaths } from "../../types";

interface RouteVisualizationProps {
  stores: Store[];
  vehicles: Vehicle[];
  routes: RoutePaths;
}

export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  stores,
  vehicles,
  routes,
}) => {
  const getStoreById = (id: number) => stores.find((s) => s.id === id);

  const getPointOnPath = (pathStoreIds: number[], progress: number) => {
    const pathCoords = pathStoreIds
      .map((id) => getStoreById(id)?.coords)
      .filter(Boolean);
    if (pathCoords.length < 2) return null;

    const totalSegments = pathCoords.length - 1;
    const targetDist = progress / 100;
    const segmentIndex = Math.min(
      Math.floor(targetDist * totalSegments),
      totalSegments - 1
    );
    const progressWithinSegment = targetDist * totalSegments - segmentIndex;
    const start = pathCoords[segmentIndex];
    const end = pathCoords[segmentIndex + 1];

    if (!start || !end) return null;

    const x = start.x + (end.x - start.x) * progressWithinSegment;
    const y = start.y + (end.y - start.y) * progressWithinSegment;
    const angle =
      (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;

    return { x, y, angle };
  };

  return (
    <div className="bg-stone-100 rounded-lg h-[500px] flex items-center justify-center relative overflow-hidden border border-stone-200/80 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-emerald-100"></div>
      <svg className="absolute inset-0 w-full h-full">
        {Object.values(routes).map((path, index) => {
          const d = path
            .map((id) => getStoreById(id)?.coords)
            .filter(Boolean)
            .map((c, i) => `${i === 0 ? "M" : "L"} ${c?.x}% ${c?.y}%`)
            .join(" ");
          return (
            <path
              key={index}
              d={d}
              stroke={index === 0 ? "#38bdf8" : "#14b8a6"}
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>
      {stores.map((store) => (
        <div
          key={store.id}
          className="absolute group"
          style={{
            left: `${store.coords.x}%`,
            top: `${store.coords.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`w-4 h-4 rounded-full shadow-md ${
              store.isWarehouse
                ? "bg-emerald-600 ring-4 ring-white/50"
                : "bg-sky-600"
            }`}
          ></div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-white shadow-md px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {store.name}
          </div>
        </div>
      ))}
      {vehicles.map((vehicle) => {
        if (vehicle.progress >= 100) return null;
        const path = routes[vehicle.routeId];
        if (!path) return null;
        const pos = getPointOnPath(path, vehicle.progress);
        if (!pos) return null;
        return (
          <div
            key={vehicle.id}
            className="absolute transition-all duration-1000 ease-linear"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.angle}deg)`,
            }}
          >
            <Truck
              className={`w-7 h-7 drop-shadow-lg ${
                vehicle.status === "delayed"
                  ? "text-rose-500"
                  : "text-amber-500"
              }`}
            />
            <div
              className="absolute top-0 left-1/2 bg-white/80 text-stone-800 text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                transform: `translate(-50%, -30px) rotate(${-pos.angle}deg)`,
              }}
            >
              {vehicle.id}
            </div>
          </div>
        );
      })}
    </div>
  );
};
