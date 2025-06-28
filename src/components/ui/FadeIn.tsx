import type { FC, ReactNode } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const FadeIn: FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}> = ({ children, delay = 0, className = "", direction = "up" }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });
  const style = { transitionDelay: `${delay}ms` };

  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${directionClasses[direction]}`
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

export default FadeIn;
