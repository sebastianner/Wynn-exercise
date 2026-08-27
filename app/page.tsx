import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { getPage } from "@/lib/contentful";

import ComponentRenderer from "@/components/ComponentRenderer/ComponentRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("");

  if (!page) {
    notFound();
  }

  return { title: "Insight Global - Home" };
}

export default async function RootPage() {
  const page = await getPage("");

  if (!page) {
    notFound();
  }

  return <ComponentRenderer components={page.components} />;
}
