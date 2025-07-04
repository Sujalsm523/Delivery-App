// src/components/routing/RoutingTab.tsx
import React, { useState } from "react";
import { Navigation, CheckCircle } from "lucide-react";
import type { RouteTableData } from "../../types";

interface RoutingTabProps {
  routeTableData: RouteTableData[];
}

export const RoutingTab: React.FC<RoutingTabProps> = ({ routeTableData }) => {
  const [routeOptimization, setRouteOptimization] = useState(false);

  const handleRouteOptimize = () => {
    setRouteOptimization(true);
    setTimeout(() => setRouteOptimization(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-800">
          Smart Route Optimization
        </h2>
        <button
          onClick={handleRouteOptimize}
          disabled={routeOptimization}
          className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 shadow-md shadow-emerald-500/30"
        >
          {routeOptimization ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              <span>Optimize Routes</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-stone-800">
          Route Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* ... Table Head ... */}
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left p-3 font-medium text-stone-500">
                  Route
                </th>
                <th className="text-left p-3 font-medium text-stone-500">
                  Distance
                </th>
                <th className="text-left p-3 font-medium text-stone-500">
                  Time
                </th>
                <th className="text-left p-3 font-medium text-stone-500">
                  Fuel
                </th>
                <th className="text-left p-3 font-medium text-stone-500">
                  CO₂
                </th>
                <th className="text-left p-3 font-medium text-stone-500">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody>
              {routeTableData.map((route, index) => (
                <tr
                  key={index}
                  className={`border-b border-stone-100 last:border-b-0 ${
                    route.route.includes("Optimized") ? "bg-emerald-50/70" : ""
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {route.route.includes("Optimized") && (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                      <span
                        className={
                          route.route.includes("Optimized")
                            ? "text-emerald-700 font-semibold"
                            : "text-stone-700"
                        }
                      >
                        {route.route}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-stone-600">{route.distance}</td>
                  <td className="p-3 text-stone-600">{route.time}</td>
                  <td className="p-3 text-stone-600">{route.fuel}</td>
                  <td className="p-3 text-stone-600">{route.co2}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-stone-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            route.efficiency > 90
                              ? "bg-emerald-500"
                              : route.efficiency > 80
                              ? "bg-amber-400"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${route.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-stone-600">
                        {route.efficiency}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
