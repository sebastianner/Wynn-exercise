import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentfulAsset } from "@/types/content-types";

import Hero from "./Hero";

const backgroundImage: ContentfulAsset = {
  url: "https://images.ctfassets.net/example/hero.jpg",
  title: "Resort at sunset",
  description: "The resort's waterfront pool at sunset",
};

describe("Hero", () => {
  it("renders the heading and subheading as semantic h1/h2", () => {
    render(
      <Hero
        heading="Escape to Encore Boston Harbor"
        subheading="A Waterfront Resort Experience"
        backgroundImage={backgroundImage}
        textJustification="left"
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Escape to Encore Boston Harbor");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("A Waterfront Resort Experience");
  });

  it("renders the background image using the asset description as alt text", () => {
    render(
      <Hero heading="Heading" subheading="Subheading" backgroundImage={backgroundImage} textJustification="left" />,
    );

    const image = screen.getByAltText(backgroundImage.description as string);
    expect(image).toHaveAttribute("src", expect.stringContaining("hero.jpg"));
  });

  it("falls back to the asset title when there is no description", () => {
    render(
      <Hero
        heading="Heading"
        subheading="Subheading"
        backgroundImage={{ ...backgroundImage, description: undefined }}
        textJustification="left"
      />,
    );

    expect(screen.getByAltText(backgroundImage.title)).toBeInTheDocument();
  });

  it.each([
    ["left", "tw:items-start"],
    ["center", "tw:items-center"],
    ["right", "tw:items-end"],
  ] as const)("positions the text block for %s justification", (justification, expectedClass) => {
    render(
      <Hero
        heading="Heading"
        subheading="Subheading"
        backgroundImage={backgroundImage}
        textJustification={justification}
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    const positioningContainer = heading.parentElement?.parentElement;
    expect(positioningContainer).toHaveClass(expectedClass);
  });

  it.each(["left", "center", "right"] as const)(
    "aligns the heading text to match %s justification",
    (justification) => {
      render(
        <Hero
          heading="Heading"
          subheading="Subheading"
          backgroundImage={backgroundImage}
          textJustification={justification}
        />,
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveClass(`tw:text-${justification}`);
    },
  );
});
