import type { MouseEventHandler, ReactNode } from "react";

import styles from "./BaseButton.module.scss";

export interface BaseButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit";
  className?: string;
}

export default function BaseButton({ children, href, onClick, type = "button", className = "" }: BaseButtonProps) {
  const classes =
    `${styles.button} tw:inline-block tw:px-6 tw:py-3 tw:text-sm tw:font-bold tw:tracking-wide tw:uppercase ${className}`.trim();

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
