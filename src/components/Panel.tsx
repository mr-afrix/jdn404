import type { ReactNode } from "react";

export const Panel = ({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) => <div className={`panel ${hover ? "panel-hover" : ""} ${className}`}>{children}</div>;
