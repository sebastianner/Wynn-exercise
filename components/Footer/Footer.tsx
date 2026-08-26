import Image from "next/image";

import type { NavigationItem } from "@/types/content-types";

import { FOOTER_TEXT, SOCIAL_LINKS } from "./constants";
import styles from "./Footer.module.scss";

export interface FooterProps {
  /** Groups of related links, rendered as separate columns. */
  linkGroups: NavigationItem[][];
  copyrightText: string;
  selfExclusionLabel: string;
}

export default function Footer({ linkGroups, copyrightText, selfExclusionLabel }: FooterProps) {
  return (
    <footer className={`${styles.footer} tw:px-4 tw:py-10 tw:sm:px-8`}>
      <div className="tw:mx-auto tw:grid tw:max-w-7xl tw:grid-cols-1 tw:gap-8 tw:sm:grid-cols-2 tw:lg:grid-cols-5 tw:lg:gap-6">
        {linkGroups.map((group) => (
          <ul
            key={group.map((item) => item.url).join("|")}
            className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center tw:lg:items-start tw:lg:text-left"
          >
            {group.map((item) => (
              <li key={item.url}>
                <a href={item.url} className={`${styles.link} tw:text-sm`}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        ))}

        <div className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center tw:sm:col-span-2 tw:lg:col-span-1 tw:lg:items-start tw:lg:text-left">
          <p className={`${styles.heading} tw:text-sm`}>{FOOTER_TEXT.hotelName}</p>
          <p className="tw:text-sm">
            {FOOTER_TEXT.addressLine1}
            <br />
            {FOOTER_TEXT.addressLine2}
          </p>
          <a href={`tel:${FOOTER_TEXT.phoneHref}`} className={`${styles.link} tw:text-sm`}>
            {FOOTER_TEXT.phone}
          </a>

          <p className={`${styles.heading} tw:mt-2 tw:text-sm`}>{FOOTER_TEXT.connectWithUs}</p>
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-4 tw:lg:justify-start">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.name} href={social.url} aria-label={social.name} className={styles.socialLink}>
                <Image src={social.icon} alt="" unoptimized width={20} height={20} className="tw:h-5 tw:w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className={`${styles.copyright} tw:mx-auto tw:mt-8 tw:max-w-7xl tw:text-center tw:text-xs`}>{copyrightText}</p>
      <p
        className={`${styles.selfExclusion} tw:mx-auto tw:mt-3 tw:max-w-5xl tw:text-center tw:text-xs tw:whitespace-pre-line`}
      >
        {selfExclusionLabel}
      </p>
    </footer>
  );
}
