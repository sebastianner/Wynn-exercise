import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAllPageSlugs } from "@/lib/contentful";

// Contentful webhook target: configure the webhook URL as
// /api/revalidate?secret=<CONTENTFUL_REVALIDATE_SECRET>, triggered on
// entry publish/unpublish for any content type (page, hero, promo, ...).
//
// A published entry has a slug only when it's a page itself; page-component
// entries (hero, promo) are nested inside a page and have no slug, so there's
// no cheap way to know which page(s) reference them here — revalidate every
// known page instead of erroring, since this is a small site.
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const slug: string | undefined = body?.fields?.slug?.["en-US"];

  if (slug) {
    const path = slug === "/" ? "/" : `/${slug.replace(/^\//, "")}`;
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, paths: [path] });
  }

  const slugs = await getAllPageSlugs();
  const paths = ["/", ...slugs.map((s) => `/${s}`)];
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
