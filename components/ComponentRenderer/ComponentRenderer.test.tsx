import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentfulAsset, PageComponent } from "@/types/content-types";

import ComponentRenderer from "./ComponentRenderer";

const heroImage: ContentfulAsset = {
  url: "https://images.ctfassets.net/example/hero-banner-1.png",
  title: "hero-banner-1",
  width: 2238,
  height: 702,
};

const promoImage: ContentfulAsset = {
  url: "https://images.ctfassets.net/example/red8-peking-duck.avif",
  title: "Red8-Peking-Duck-Braga-828x466",
  width: 828,
  height: 466,
};

const hero: PageComponent = {
  id: "5KlOXAY0q40oUBI9glm3Y6",
  contentType: "hero",
  heading: "Build Something Amazing",
  subheading: "The platform trusted by thousands of teams worldwide.",
  backgroundImage: heroImage,
  textJustification: "left",
};

const promo: PageComponent = {
  id: "7gcXSN16dQ26zDunyc15Qe",
  contentType: "promo",
  title: "Limited Time Offer",
  description: "Save 20% on your first purchase when you sign up today.",
  ctaLabel: "Shop Now",
  ctaUrl: "/shop",
  imagePosition: "left",
  image: promoImage,
};

describe("ComponentRenderer", () => {
  it("renders a Hero for a hero entry", () => {
    render(<ComponentRenderer components={[hero]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Build Something Amazing" })).toBeInTheDocument();
  });

  it("renders a Promo for a promo entry", () => {
    render(<ComponentRenderer components={[promo]} />);

    expect(screen.getByRole("heading", { level: 3, name: "Limited Time Offer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop Now" })).toHaveAttribute("href", "/shop");
  });

  it("renders each entry in order for a mixed list", () => {
    render(<ComponentRenderer components={[hero, promo]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Build Something Amazing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Limited Time Offer" })).toBeInTheDocument();
  });

  it("skips an entry whose contentType has no matching component", () => {
    const unknown = { ...promo, contentType: "unknown" } as unknown as PageComponent;

    render(<ComponentRenderer components={[hero, unknown]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Build Something Amazing" })).toBeInTheDocument();
    expect(screen.queryByText("Limited Time Offer")).not.toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<ComponentRenderer components={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
