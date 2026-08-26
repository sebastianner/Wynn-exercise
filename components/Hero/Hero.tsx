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

export default function Hero({ heading, subheading, backgroundImage, textJustification }: HeroProps) {
  return (
    <section className={`${styles.banner} tw:relative tw:w-full tw:overflow-hidden`}>
      <Image
        src={backgroundImage.url}
        alt={backgroundImage.description || backgroundImage.title}
        fill
        unoptimized
        sizes="100vw"
        className="tw:object-cover"
      />
      <div className={styles.scrim} />
      <div
        className={`tw:relative tw:flex tw:h-full tw:flex-col tw:justify-center tw:px-6 tw:py-10 tw:sm:px-12 tw:lg:px-20 ${JUSTIFICATION_CLASS[textJustification]}`}
      >
        <div className="tw:flex tw:max-w-3xl tw:flex-col tw:gap-3">
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
