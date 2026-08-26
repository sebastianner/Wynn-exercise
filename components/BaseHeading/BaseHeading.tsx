import type { CSSProperties, ReactNode } from "react";

import { Playfair_Display } from "next/font/google";

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
  /** Extra classes appended after the built-in ones, e.g. a responsive alignment override. */
  className?: string;
}

// H1 gets a distinct display serif; every other level shares the site's sans-serif.
// Each level scales up gradually across breakpoints instead of jumping straight
// from its mobile size to its desktop size.
const LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: `${playfairDisplay.className} tw:text-3xl tw:font-bold tw:leading-tight tw:sm:text-4xl tw:md:text-5xl tw:lg:text-6xl tw:xl:text-7xl`,
  2: "tw:font-sans tw:text-xl tw:font-semibold tw:leading-snug tw:sm:text-2xl tw:md:text-3xl tw:lg:text-4xl",
  3: "tw:font-sans tw:text-lg tw:font-semibold tw:leading-snug tw:sm:text-xl tw:md:text-2xl tw:lg:text-3xl",
  4: "tw:font-sans tw:text-base tw:font-semibold tw:leading-snug tw:sm:text-lg tw:md:text-xl tw:lg:text-2xl",
  5: "tw:font-sans tw:text-sm tw:font-semibold tw:leading-snug tw:sm:text-base tw:md:text-lg tw:lg:text-xl",
  6: "tw:font-sans tw:text-xs tw:font-bold tw:leading-snug tw:tracking-wide tw:uppercase tw:sm:text-sm tw:md:text-base tw:lg:text-lg",
};

const ALIGN_CLASS: Record<TextAlign, string> = {
  left: "tw:text-left",
  center: "tw:text-center",
  right: "tw:text-right",
};

// Vertical margin scales with each level's own size/breakpoints, biggest for
// the H1 display title, tapering down through the smaller heading levels.
const MARGIN_CLASS: Record<HeadingLevel, string> = {
  1: "tw:my-2 tw:sm:my-3 tw:md:my-4 tw:lg:my-5 tw:xl:my-6",
  2: "tw:my-1 tw:sm:my-2 tw:md:my-2 tw:lg:my-3",
  3: "tw:my-1 tw:sm:my-1 tw:md:my-2 tw:lg:my-2",
  4: "tw:my-1 tw:sm:my-1 tw:md:my-1 tw:lg:my-2",
  5: "tw:my-0.5 tw:sm:my-1 tw:md:my-1 tw:lg:my-1",
  6: "tw:my-0.5 tw:sm:my-0.5 tw:md:my-1 tw:lg:my-1",
};

export default function BaseHeading({ level, children, color, textAlign = "left", className = "" }: BaseHeadingProps) {
  const Tag = `h${level}` as `h${HeadingLevel}`;
  const style: CSSProperties | undefined = color ? { color } : undefined;

  return (
    <Tag
      className={`tw:text-balance ${LEVEL_CLASS[level]} ${MARGIN_CLASS[level]} ${ALIGN_CLASS[textAlign]} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
