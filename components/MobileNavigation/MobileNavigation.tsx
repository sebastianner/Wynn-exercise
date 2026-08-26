import type { NavigationItem } from "@/types/content-types";

import { MOBILE_NAVIGATION_TEXT } from "./constants";
import styles from "./MobileNavigation.module.scss";

export interface MobileNavigationProps {
  items: NavigationItem[];
}

/** Mobile-only navigation drawer content. Rendered by Header inside its hamburger menu. */
export default function MobileNavigation({ items }: MobileNavigationProps) {
  return (
    <nav aria-label={MOBILE_NAVIGATION_TEXT.navLabel} className={`${styles.nav} tw:h-full tw:overflow-y-auto`}>
      <ul className="tw:flex tw:flex-col tw:gap-7 tw:px-6 tw:py-8">
        {items.map((item) => (
          <li key={item.url}>
            <a href={item.url} className={`${styles.navLink} tw:text-sm tw:font-bold tw:uppercase`}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
