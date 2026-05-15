import { ReactNode } from "react";
import { useReveal } from "@/hooks/useGitHub";

export const Reveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
