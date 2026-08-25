/** Resolved Contentful image asset (id/url/dimensions already flattened out of the sys/fields wrapper). */
export interface ContentfulAsset {
  url: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
}

// ---------------------------------------------------------------------------
// Global content types
// ---------------------------------------------------------------------------

export interface HeaderProps {
  logo: ContentfulAsset;
  siteName: string;
}

export interface FooterProps {
  links: NavigationItem[];
  copyrightText: string;
}

export interface NavigationItem {
  name: string;
  url: string;
}

export interface NavigationProps {
  items: NavigationItem[];
}

// ---------------------------------------------------------------------------
// Page component content types
// ---------------------------------------------------------------------------

export interface HeroProps {
  id: string;
  contentType: "hero";
  heading: string;
  subheading: string;
  backgroundImage: ContentfulAsset;
}

export type PromoImagePosition = "left" | "right";

export interface PromoProps {
  id: string;
  contentType: "promo";
  image: ContentfulAsset;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imagePosition: PromoImagePosition;
}

/** Discriminated union consumed by ComponentRenderer to pick hero/promo. */
export type PageComponent = HeroProps | PromoProps;

// ---------------------------------------------------------------------------
// Page content type
// ---------------------------------------------------------------------------

export interface PageProps {
  title: string;
  slug: string;
  components: PageComponent[];
}
