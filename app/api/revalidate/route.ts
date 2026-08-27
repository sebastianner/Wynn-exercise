import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Contentful webhook target: configure the webhook URL as
// /api/revalidate?secret=<CONTENTFUL_REVALIDATE_SECRET>, triggered on
// entry publish/unpublish for the "page" content type.
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const slug: string | undefined = body?.fields?.slug?.["en-US"];

  if (!slug) {
    return NextResponse.json({ message: "Missing slug in payload" }, { status: 400 });
  }

  const path = slug === "/" ? "/" : `/${slug.replace(/^\//, "")}`;
  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
