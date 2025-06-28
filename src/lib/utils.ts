  // src/lib/utils.ts
  import type{ StorePriority, VehicleStatus } from "../types";

export const getStatusColor = (priority: 'critical' | 'high' | 'medium' | 'low'): string => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  export const getVehicleStatusColor = (status: 'completed' | 'on-time' | 'delayed'): string => {
    switch (status) {
      case "completed": return "text-green-600";
      case "on-time": return "text-blue-600";
      case "delayed": return "text-red-600";
      default: return "text-gray-600";
    }
  };



/**
 * Returns a Tailwind CSS background color class based on store priority.
 * @param priority The priority of the store's stock level.
 * @returns A string with the corresponding CSS class.
 */
export const getPriorityStatusColor = (priority?: StorePriority): string => {
  switch (priority) {
    case "critical": return "bg-rose-500";
    case "high": return "bg-amber-500";
    case "medium": return "bg-yellow-400";
    case "low": return "bg-emerald-500";
    default: return "bg-stone-400";
  }
};

/**
 * Returns Tailwind CSS text and background color classes for vehicle status.
 * @param status The current status of the vehicle.
 * @returns An object with text and background CSS classes.
 */
export const getVehicleStatusStyling = (status: VehicleStatus): { text: string; bg: string; } => {
    switch (status) {
      case "completed": return { text: "text-emerald-600", bg: "bg-emerald-100" };
      case "on-time": return { text: "text-sky-600", bg: "bg-sky-100" };
      case "delayed": return { text: "text-rose-600", bg: "bg-rose-100" };
      default: return { text: "text-stone-600", bg: "bg-stone-100" };
    }
};