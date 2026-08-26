import {
  createClient,
  type Asset,
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
