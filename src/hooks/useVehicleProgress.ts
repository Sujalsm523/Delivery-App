// src/hooks/useVehicleProgress.ts
import { useState, useEffect } from 'react';
import type{ Vehicle } from '../types';
import { initialVehicles } from '../data/mockData';

export const useVehicleProgress = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.status !== 'completed'
            ? { ...v, progress: Math.min(v.progress + 0.2, 100) }
            : v
        )
      );
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return vehicles;
};