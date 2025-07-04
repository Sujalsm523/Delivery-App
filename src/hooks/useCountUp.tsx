import { useEffect, useState } from "react";

const useCountUp = (end: number, duration: number, isVisible: boolean) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    if (!isVisible) return;

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * progress);
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(end); // Ensure it ends on the exact number
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [isVisible, end, duration, totalFrames, frameRate]);

  return count;
};

export default useCountUp;
