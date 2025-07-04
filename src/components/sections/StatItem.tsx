import type { FC } from "react";
import useCountUp from "../../hooks/useCountUp";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const StatItem: FC<{
  stat: { number: number; suffix: string; label: string };
}> = ({ stat }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
  const count = useCountUp(stat.number, 2000, isVisible);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-green-600 mb-2">
        {count}
        {stat.suffix}
      </p>
      <p className="text-sm md:text-base text-slate-500">{stat.label}</p>
    </div>
  );
};

export default StatItem;
