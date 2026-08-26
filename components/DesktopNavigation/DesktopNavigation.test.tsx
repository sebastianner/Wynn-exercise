import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NavigationItem } from "@/types/content-types";

import DesktopNavigation from "./DesktopNavigation";

const items: NavigationItem[] = [
  { name: "Rooms & Suites", url: "/rooms-suites" },
  { name: "Dining", url: "/dining" },
  { name: "Casino", url: "/casino" },
];

describe("DesktopNavigation", () => {
  it("renders each navigation item as a link", () => {
    render(<DesktopNavigation items={items} />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const item of items) {
      expect(within(nav).getByRole("link", { name: item.name })).toHaveAttribute("href", item.url);
    }
  });

  it("renders no links when there are no items", () => {
    render(<DesktopNavigation items={[]} />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).queryAllByRole("link")).toHaveLength(0);
  });

  it("marks the item matching activeUrl as the current page", () => {
    render(<DesktopNavigation items={items} activeUrl="/dining" />);

    expect(screen.getByRole("link", { name: "Dining" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Casino" })).not.toHaveAttribute("aria-current");
  });
});
