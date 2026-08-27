import Image from "next/image";

import type { ContentfulAsset } from "@/types/content-types";

import BaseHeading, { type TextAlign } from "@/components/BaseHeading/BaseHeading";

import styles from "./Hero.module.scss";

export interface HeroProps {
  heading: string;
  subheading: string;
  backgroundImage: ContentfulAsset;
  textJustification: TextAlign;
}

// Positions the text block within the banner, matching the requested justification.
const JUSTIFICATION_CLASS: Record<TextAlign, string> = {
  left: "tw:items-start",
  center: "tw:items-center",
  right: "tw:items-end",
};

// Left/right text sits over the image rather than spanning it, so it's capped
// to 55% of the banner's width on mobile, 65% from lg up, then back down to
// 60% at xl (and wraps at that cap); a centered heading is free to use the
// wider, fixed cap.
const TEXT_WIDTH_CLASS: Record<TextAlign, string> = {
  left: "tw:max-w-[55%] tw:lg:max-w-[65%] tw:xl:max-w-[60%]",
  center: "tw:max-w-3xl",
  right: "tw:max-w-[55%] tw:lg:max-w-[65%] tw:xl:max-w-[60%]",
};

export default function Hero({ heading, subheading, backgroundImage, textJustification }: HeroProps) {
  return (
    <section className={`${styles.banner} tw:relative tw:w-full tw:overflow-hidden`}>
      <Image
        src={backgroundImage.url}
        alt={backgroundImage.description || backgroundImage.title}
        fill
        unoptimized
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="tw:object-cover tw:lg:object-fill"
      />
      <div className={styles.scrim} />
      <div
        className={`tw:relative tw:flex tw:h-full tw:flex-col tw:justify-center tw:px-6 tw:py-10 tw:sm:px-12 tw:lg:px-20 ${JUSTIFICATION_CLASS[textJustification]}`}
      >
        <div className={`tw:flex tw:flex-col tw:py-2 tw:sm:py-3 tw:lg:py-4 ${TEXT_WIDTH_CLASS[textJustification]}`}>
          <BaseHeading level={1} textAlign={textJustification} color="#fff">
            {heading}
          </BaseHeading>
          <BaseHeading level={2} textAlign={textJustification} color="#fff">
            {subheading}
          </BaseHeading>
        </div>
      </div>
    </section>
  );
}
