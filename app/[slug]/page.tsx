import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { getAllPageSlugs, getPage } from "@/lib/contentful";

import ComponentRenderer from "@/components/ComponentRenderer/ComponentRenderer";

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return { title: `Wynn - ${page.title}` };
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return <ComponentRenderer components={page.components} />;
}
