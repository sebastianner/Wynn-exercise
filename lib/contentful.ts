import {
  createClient,
  type Asset,
  type Entry,
  type EntryFieldTypes,
  type EntrySkeletonType,
  type UnresolvedLink,
} from "contentful";

import type {
  ContentfulAsset,
  FooterProps,
  HeaderProps,
  NavigationItem,
  NavigationProps,
  PageComponent,
  PageProps,
  PromoImagePosition,
  TextJustification,
} from "@/types/content-types";

interface HeaderSkeleton extends EntrySkeletonType {
  contentTypeId: "header";
  fields: {
    siteName: EntryFieldTypes.Symbol;
    logo: EntryFieldTypes.AssetLink;
  };
}

interface NavigationSkeleton extends EntrySkeletonType {
  contentTypeId: "navigation";
  fields: {
    items: EntryFieldTypes.Object;
  };
}

interface FooterSkeleton extends EntrySkeletonType {
  contentTypeId: "footer";
  fields: {
    copyrightText: EntryFieldTypes.Symbol;
    links: EntryFieldTypes.Object;
    selfExclusionLabel: EntryFieldTypes.Text;
  };
}

interface HeroEntrySkeleton extends EntrySkeletonType {
  contentTypeId: "hero";
  fields: {
    heading: EntryFieldTypes.Symbol;
    subheading: EntryFieldTypes.Symbol;
    backgroundImage: EntryFieldTypes.AssetLink;
    textJustification: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  };
}

interface PromoEntrySkeleton extends EntrySkeletonType {
  contentTypeId: "promo";
  fields: {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    ctaLabel: EntryFieldTypes.Symbol;
    ctaUrl: EntryFieldTypes.Symbol;
    imagePosition: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
  };
}

// `undefined` is the "no chain modifiers" case — matches our plain, un-chained
// `client` below (no `.withAllLocales()`/`.withoutLinkResolution()` etc).
type PageComponentEntry =
  | Entry<HeroEntrySkeleton, undefined>
  | Entry<PromoEntrySkeleton, undefined>
  | UnresolvedLink<"Entry">;

interface PageSkeleton extends EntrySkeletonType {
  contentTypeId: "page";
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    components: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<HeroEntrySkeleton | PromoEntrySkeleton>>;
  };
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

function toAsset(asset: Asset<undefined, string> | UnresolvedLink<"Asset">): ContentfulAsset {
  if (!("fields" in asset)) {
    throw new Error(`Contentful asset link "${asset.sys.id}" could not be resolved.`);
  }
  const file = asset.fields.file;
  if (!file?.url) {
    throw new Error(`Contentful asset "${asset.sys.id}" is missing a file.`);
  }
  return {
    url: file.url.startsWith("//") ? `https:${file.url}` : file.url,
    title: asset.fields.title ?? "",
    description: asset.fields.description,
    width: file.details.image?.width,
    height: file.details.image?.height,
  };
}

export async function getHeader(): Promise<HeaderProps | null> {
  const { items } = await client.getEntries<HeaderSkeleton>({
    content_type: "header",
    limit: 1,
  });
  const entry = items[0];
  if (!entry) return null;

  return {
    siteName: entry.fields.siteName,
    logo: toAsset(entry.fields.logo),
  };
}

export async function getNavigation(): Promise<NavigationProps | null> {
  const { items } = await client.getEntries<NavigationSkeleton>({
    content_type: "navigation",
    limit: 1,
  });
  const entry = items[0];
  if (!entry) return null;

  return {
    items: entry.fields.items as unknown as NavigationItem[],
  };
}

// A component entry that failed to resolve (bad include depth, unpublished,
// deleted, or an unrecognized content type) is skipped rather than crashing
// the whole page.
function toPageComponent(entry: PageComponentEntry): PageComponent | null {
  if (!("fields" in entry)) return null;

  const contentTypeId = entry.sys.contentType.sys.id;

  if (contentTypeId === "hero") {
    const hero = entry as Entry<HeroEntrySkeleton, undefined>;
    return {
      id: hero.sys.id,
      contentType: "hero",
      heading: hero.fields.heading,
      subheading: hero.fields.subheading,
      backgroundImage: toAsset(hero.fields.backgroundImage),
      textJustification: (hero.fields.textJustification?.[0] as TextJustification) ?? "left",
    };
  }

  if (contentTypeId === "promo") {
    const promo = entry as Entry<PromoEntrySkeleton, undefined>;
    return {
      id: promo.sys.id,
      contentType: "promo",
      title: promo.fields.title,
      description: promo.fields.description,
      ctaLabel: promo.fields.ctaLabel,
      ctaUrl: promo.fields.ctaUrl,
      imagePosition: promo.fields.imagePosition as PromoImagePosition,
      image: toAsset(promo.fields.image),
    };
  }

  return null;
}

export async function getPage(slug: string): Promise<PageProps | null> {
  const { items } = await client.getEntries<PageSkeleton>({
    content_type: "page",
    "fields.slug": `/${slug}`,
    include: 2,
    limit: 1,
  });
  const entry = items[0];
  if (!entry) return null;

  return {
    title: entry.fields.title,
    slug: entry.fields.slug,
    components: entry.fields.components.map(toPageComponent).filter((component) => component !== null),
  };
}

export async function getAllPageSlugs(): Promise<string[]> {
  const { items } = await client.getEntries<PageSkeleton>({
    content_type: "page",
    select: ["fields.slug"],
  });
  return items.map((item) => item.fields.slug.replace(/^\//, ""));
}

export async function getFooter(): Promise<FooterProps | null> {
  const { items } = await client.getEntries<FooterSkeleton>({
    content_type: "footer",
    limit: 1,
  });
  const entry = items[0];
  if (!entry) return null;

  return {
    linkGroups: entry.fields.links as unknown as NavigationItem[][],
    copyrightText: entry.fields.copyrightText,
    selfExclusionLabel: entry.fields.selfExclusionLabel,
  };
}
