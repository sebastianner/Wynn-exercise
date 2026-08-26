import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NavigationItem } from "@/types/content-types";

import MobileNavigation from "./MobileNavigation";

const items: NavigationItem[] = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
];

describe("MobileNavigation", () => {
  it("renders each navigation item as a link", () => {
    render(<MobileNavigation items={items} />);

    const nav = screen.getByRole("navigation", { name: "Mobile" });
    for (const item of items) {
      expect(within(nav).getByRole("link", { name: item.name })).toHaveAttribute("href", item.url);
    }
  });

  it("renders no links when there are no items", () => {
    render(<MobileNavigation items={[]} />);

    const nav = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(nav).queryAllByRole("link")).toHaveLength(0);
  });
});
