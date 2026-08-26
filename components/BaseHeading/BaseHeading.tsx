import type { CSSProperties, ReactNode } from "react";

import { Playfair_Display } from "next/font/google";

import styles from "./BaseHeading.module.scss";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextAlign = "left" | "center" | "right";

export interface BaseHeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  color?: string;
  textAlign?: TextAlign;
}

// H1 gets a distinct display serif; every other level shares the site's sans-serif.
const LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: `${playfairDisplay.className} tw:text-4xl tw:font-bold tw:leading-tight tw:lg:text-6xl`,
  2: "tw:font-sans tw:text-2xl tw:font-semibold tw:leading-snug tw:lg:text-3xl",
  3: "tw:font-sans tw:text-xl tw:font-semibold tw:leading-snug tw:lg:text-2xl",
  4: "tw:font-sans tw:text-lg tw:font-semibold tw:leading-snug tw:lg:text-xl",
  5: "tw:font-sans tw:text-base tw:font-semibold tw:leading-snug tw:lg:text-lg",
  6: "tw:font-sans tw:text-sm tw:font-bold tw:leading-snug tw:tracking-wide tw:uppercase tw:lg:text-base",
};

const ALIGN_CLASS: Record<TextAlign, string> = {
  left: "tw:text-left",
  center: "tw:text-center",
  right: "tw:text-right",
};

export default function BaseHeading({ level, children, color, textAlign = "left" }: BaseHeadingProps) {
  const Tag = `h${level}` as `h${HeadingLevel}`;
  const style: CSSProperties | undefined = color ? { color } : undefined;

  return (
    <Tag className={`${styles.heading} ${LEVEL_CLASS[level]} ${ALIGN_CLASS[textAlign]}`} style={style}>
      {children}
    </Tag>
  );
}
