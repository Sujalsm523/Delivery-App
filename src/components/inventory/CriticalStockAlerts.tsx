// src/components/inventory/CriticalStockAlerts.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { type Store } from "../../types";

interface CriticalStockAlertsProps {
  stores: Store[];
}

export const CriticalStockAlerts: React.FC<CriticalStockAlertsProps> = ({
  stores,
}) => {
  const criticalStores = stores.filter(
    (store) => store.priority === "critical"
  );

  if (criticalStores.length === 0) {
    return null; // Or a message indicating no critical alerts
  }

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center text-stone-800">
        <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
        Critical Stock Alerts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criticalStores.map((store) => (
          <div
            key={store.id}
            className="bg-rose-50 border border-rose-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-rose-800">{store.name}</h4>
                <p className="text-sm text-stone-600 mt-1">
                  Stock critically low: {store.stock} units remaining
                </p>
                <p className="text-sm font-semibold text-rose-600 mt-1">
                  Expected shortage in 2-3 hours
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            </div>
            <button className="mt-4 bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Schedule Emergency Delivery
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
