import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentfulAsset } from "@/types/content-types";

import Promo from "./Promo";

const image: ContentfulAsset = {
  url: "https://images.ctfassets.net/example/promo.jpg",
  title: "Peking duck",
  description: "A whole Peking duck plated tableside",
  width: 828,
  height: 466,
};

describe("Promo", () => {
  it("renders the title, description, and CTA link", () => {
    render(
      <Promo
        image={image}
        title="Peking Duck Special"
        description="Available every Wednesday through Friday."
        ctaLabel="Make a Reservation"
        ctaUrl="/reservations"
        imagePosition="left"
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Peking Duck Special" })).toBeInTheDocument();
    expect(screen.getByText("Available every Wednesday through Friday.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Make a Reservation" })).toHaveAttribute("href", "/reservations");
  });

  it("renders the image with descriptive alt text", () => {
    render(
      <Promo
        image={image}
        title="Title"
        description="Description"
        ctaLabel="CTA"
        ctaUrl="/cta"
        imagePosition="left"
      />,
    );

    const img = screen.getByAltText(image.description as string);
    expect(img).toHaveAttribute("src", expect.stringContaining("promo.jpg"));
  });

  it("falls back to the asset title when there is no description", () => {
    render(
      <Promo
        image={{ ...image, description: undefined }}
        title="Title"
        description="Description"
        ctaLabel="CTA"
        ctaUrl="/cta"
        imagePosition="left"
      />,
    );

    expect(screen.getByAltText(image.title)).toBeInTheDocument();
  });

  it.each([
    ["left", false],
    ["right", true],
  ] as const)("reverses the row order when imagePosition is %s", (position, expectReversed) => {
    render(
      <Promo
        image={image}
        title="Title"
        description="Description"
        ctaLabel="CTA"
        ctaUrl="/cta"
        imagePosition={position}
      />,
    );

    const section = screen.getByRole("heading", { level: 3 }).closest("section");
    if (expectReversed) {
      expect(section).toHaveClass("tw:xl:flex-row-reverse");
    } else {
      expect(section).not.toHaveClass("tw:xl:flex-row-reverse");
    }
  });
});
