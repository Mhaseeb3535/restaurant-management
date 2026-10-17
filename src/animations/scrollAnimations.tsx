import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollAnimateProps {
  children: ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  threshold?: number;
}

export function ScrollAnimate({
  children,
  className = "",
  animation = "animate-fade-up",
  delay = 0,
  threshold = 0.1,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animation : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
