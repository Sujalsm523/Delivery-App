import React, { type FC, type ReactNode } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn: FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const style = { transitionDelay: `${delay}ms` };

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

export default FadeIn;
