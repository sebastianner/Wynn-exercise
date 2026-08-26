import type { NavigationItem } from "@/types/content-types";

import { DESKTOP_NAVIGATION_TEXT } from "./constants";
import styles from "./DesktopNavigation.module.scss";

export interface DesktopNavigationProps {
  items: NavigationItem[];
  /** URL of the current page, if any — that item's underline stays on without hovering. */
  activeUrl?: string;
}

/** Desktop-only horizontal navigation bar. Presentational and prop-driven. */
export default function DesktopNavigation({ items, activeUrl }: DesktopNavigationProps) {
  return (
    <nav aria-label={DESKTOP_NAVIGATION_TEXT.navLabel} className={`${styles.nav} tw:border-b`}>
      <ul className="tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-x-8 tw:gap-y-3 tw:px-4 tw:py-4">
        {items.map((item) => {
          const isActive = item.url === activeUrl;
          return (
            <li key={item.url}>
              <a
                href={item.url}
                aria-current={isActive ? "page" : undefined}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""} tw:text-sm tw:font-bold tw:uppercase`}
              >
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
