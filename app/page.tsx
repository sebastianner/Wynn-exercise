import { notFound } from "next/navigation";

import { getPage } from "@/lib/contentful";

import ComponentRenderer from "@/components/ComponentRenderer/ComponentRenderer";

export default async function RootPage() {
  const page = await getPage("");

  if (!page) {
    notFound();
  }

  return <ComponentRenderer components={page.components} />;
}
