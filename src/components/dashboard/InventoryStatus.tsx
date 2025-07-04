// src/components/dashboard/InventoryStatus.tsx
import React from "react";
import { Package } from "lucide-react";
import type { Store } from "../../types";
import { getPriorityStatusColor } from "../../lib/utils";

interface InventoryStatusProps {
  stores: Store[];
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ stores }) => {
  return (
    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center text-stone-800">
        <Package className="w-6 h-6 mr-3 text-sky-500" />
        Store Inventory Status
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stores
          .filter((s) => !s.isWarehouse)
          .map((store) => (
            <div
              key={store.id}
              className="bg-stone-50/70 rounded-lg p-4 border border-stone-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-stone-800">{store.name}</h4>
                <div
                  className={`w-3 h-3 rounded-full ${getPriorityStatusColor(
                    store.priority
                  )}`}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Current Stock:</span>
                  <span className="font-medium text-stone-700">
                    {store.stock} units
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Predicted Demand:</span>
                  <span className="font-medium text-sky-600">
                    {store.demand} units
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      (store.stock || 0) < (store.demand || 0)
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        ((store.stock || 0) / (store.demand || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
