// src/components/inventory/InventoryTab.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CriticalStockAlerts } from "./CriticalStockAlerts";
import type { ForecastDataPoint, Store } from "../../types";

interface InventoryTabProps {
  forecastData: ForecastDataPoint[];
  stores: Store[];
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  forecastData,
  stores,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-stone-800">
        Inventory Demand Forecasting
      </h2>
      <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-stone-800">
          7-Day Demand Prediction
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={forecastData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" stroke="#a8a29e" />
            <YAxis stroke="#a8a29e" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #e7e5e4",
                borderRadius: "0.75rem",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#38bdf8"
              strokeWidth={3}
              name="Predicted Demand"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={2}
              name="Actual Demand"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <CriticalStockAlerts stores={stores} />
    </div>
  );
};
