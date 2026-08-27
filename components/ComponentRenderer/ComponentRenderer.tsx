import type { ComponentType } from "react";

import type { PageComponent } from "@/types/content-types";

import Hero from "@/components/Hero/Hero";
import Promo from "@/components/Promo/Promo";

export interface ComponentRendererProps {
  components: PageComponent[];
}

// Maps a resolved entry's contentType id straight to the component that
// renders it — add an entry here whenever a new page-component content type
// is introduced in Contentful. Each component below is fully typed on its
// own; `any` here is just the registry's necessarily-loose common type,
// since Hero and Promo don't share a single props shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<PageComponent["contentType"], ComponentType<any>> = {
  hero: Hero,
  promo: Promo,
};

export default function ComponentRenderer({ components }: ComponentRendererProps) {
  return (
    <>
      {components.map(({ id, contentType, ...props }) => {
        const Component = COMPONENT_MAP[contentType];
        if (!Component) return null;

        return <Component key={id} {...props} />;
      })}
    </>
  );
}
