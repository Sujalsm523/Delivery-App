import type { FC } from "react";
import StatItem from "./StatItem";
const StatsSection: FC = () => {
  const stats = [
    { number: 50, suffix: "K+", label: "Deliveries" },
    { number: 2500, suffix: "+", label: "Volunteers" },
    { number: 40, suffix: "%", label: "Carbon Reduction" },
    { number: 98, suffix: "%", label: "Satisfaction" },
  ];

  return (
    <section id="impact" className="py-20 sm:py-24 bg-white-100 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
