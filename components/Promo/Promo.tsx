import Image from "next/image";

import type { ContentfulAsset } from "@/types/content-types";

import BaseButton from "@/components/BaseButton/BaseButton";
import BaseHeading from "@/components/BaseHeading/BaseHeading";

import styles from "./Promo.module.scss";

export type PromoImagePosition = "left" | "right";

export interface PromoProps {
  image: ContentfulAsset;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imagePosition: PromoImagePosition;
}

export default function Promo({ image, title, description, ctaLabel, ctaUrl, imagePosition }: PromoProps) {
  // Text sits opposite the image, so once they're side by side (xl+) the text
  // aligns toward its own outer edge instead of staying centered; on mobile,
  // where the layout is stacked, it stays centered regardless of the prop.
  const isImageLeft = imagePosition === "left";
  const desktopAlignClass = isImageLeft ? "tw:xl:items-end tw:xl:text-right" : "tw:xl:items-start tw:xl:text-left";
  const headingAlignClass = isImageLeft ? "tw:xl:text-right" : "tw:xl:text-left";
  // The image is centered in its column pre-xl, but once it's side by side
  // with the text (xl+) it needs to hug the same outer edge the text hugs on
  // its own side — otherwise stacked Promo instances don't line up: the
  // image would float centered in its half while text on the matching side
  // (in another instance) sits flush against the true edge.
  const imageAlignClass = isImageLeft ? "tw:xl:mr-auto tw:xl:ml-0" : "tw:xl:ml-auto tw:xl:mr-0";

  return (
    <section
      className={`tw:mx-auto tw:flex tw:max-w-7xl tw:flex-col tw:gap-5 tw:px-4 tw:py-10 tw:sm:px-8 tw:xl:flex-row tw:xl:items-center tw:xl:gap-6 ${
        imagePosition === "right" ? "tw:xl:flex-row-reverse" : ""
      }`}
    >
      <div
        className={`${styles.imageWrapper} tw:relative tw:mx-auto tw:w-full tw:max-w-full tw:md:max-w-[750px] tw:md:max-h-[422px] tw:xl:w-1/2 tw:xl:max-w-[530px] tw:xl:max-h-[300px] ${imageAlignClass}`}
      >
        <Image
          src={image.url}
          alt={image.description || image.title}
          fill
          unoptimized
          sizes="(min-width: 1280px) 50vw, 100vw"
          className={`${styles.image} tw:object-cover`}
        />
      </div>

      <div className={`tw:flex tw:flex-col tw:items-center tw:gap-4 tw:text-center tw:xl:w-1/2 ${desktopAlignClass}`}>
        <BaseHeading level={3} textAlign="center" color="#1a1a1a" className={headingAlignClass}>
          {title}
        </BaseHeading>
        <p className={`${styles.description} tw:max-w-md tw:whitespace-pre-line tw:text-sm`}>{description}</p>
        <BaseButton href={ctaUrl}>{ctaLabel}</BaseButton>
      </div>
    </section>
  );
}
