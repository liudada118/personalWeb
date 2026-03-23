"use client";

import { useEffect, useRef, useState } from "react";

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function RevealSection({ children, className }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`reveal-section${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`} ref={ref}>
      {children}
    </div>
  );
}
