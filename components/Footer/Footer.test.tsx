import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NavigationItem } from "@/types/content-types";

import Footer from "./Footer";

const linkGroups: NavigationItem[][] = [
  [
    { name: "Shop Home Collection", url: "/shop-home-collection" },
    { name: "Gift Cards", url: "/gift-cards" },
  ],
  [
    { name: "About Us", url: "/about-us" },
    { name: "Careers", url: "/careers" },
  ],
];

const copyrightText = "© 2026 Encore Boston Harbor. All rights reserved.";
const selfExclusionLabel = "If you or a loved one is experiencing problems with gambling, call (800) 327-5050.";

describe("Footer", () => {
  it("renders each link group as its own column of links", () => {
    render(<Footer linkGroups={linkGroups} copyrightText={copyrightText} selfExclusionLabel={selfExclusionLabel} />);

    for (const group of linkGroups) {
      for (const item of group) {
        expect(screen.getByRole("link", { name: item.name })).toHaveAttribute("href", item.url);
      }
    }
  });

  it("renders no links when there are no link groups", () => {
    render(<Footer linkGroups={[]} copyrightText={copyrightText} selfExclusionLabel={selfExclusionLabel} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer.querySelectorAll("li")).toHaveLength(0);
  });

  it("renders the hotel contact information", () => {
    render(<Footer linkGroups={[]} copyrightText={copyrightText} selfExclusionLabel={selfExclusionLabel} />);

    expect(screen.getByText("Encore Boston Harbor")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+1 (857) 770-7000" })).toHaveAttribute("href", "tel:+18577707000");
  });

  it("renders a labeled link for each social platform", () => {
    render(<Footer linkGroups={[]} copyrightText={copyrightText} selfExclusionLabel={selfExclusionLabel} />);

    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "TikTok" })).toBeInTheDocument();
  });

  it("renders the copyright text", () => {
    render(<Footer linkGroups={[]} copyrightText={copyrightText} selfExclusionLabel={selfExclusionLabel} />);

    expect(screen.getByText(copyrightText)).toBeInTheDocument();
  });

  it("renders the self-exclusion label", () => {
    render(<Footer linkGroups={[]} copyrightText={copyrightText} selfExclusionLabel={selfExclusionLabel} />);

    expect(screen.getByText(selfExclusionLabel)).toBeInTheDocument();
  });
});
