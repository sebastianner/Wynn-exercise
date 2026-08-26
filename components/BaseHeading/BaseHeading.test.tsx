import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BaseHeading, { type HeadingLevel } from "./BaseHeading";

describe("BaseHeading", () => {
  it.each([1, 2, 3, 4, 5, 6] satisfies HeadingLevel[])("renders a semantic h%i for level %i", (level) => {
    render(<BaseHeading level={level}>Heading text</BaseHeading>);

    expect(screen.getByRole("heading", { level })).toHaveTextContent("Heading text");
  });

  it("defaults to left text alignment", () => {
    render(<BaseHeading level={2}>Default alignment</BaseHeading>);

    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("tw:text-left");
  });

  it("applies the requested text alignment", () => {
    render(
      <BaseHeading level={1} textAlign="right">
        Right aligned
      </BaseHeading>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("tw:text-right");
  });

  it("applies the given color as an inline style", () => {
    render(
      <BaseHeading level={1} color="#775c3d">
        Gold heading
      </BaseHeading>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveStyle({ color: "rgb(119, 92, 61)" });
  });

  it("does not set an inline color when none is given", () => {
    render(<BaseHeading level={1}>No color</BaseHeading>);

    expect(screen.getByRole("heading", { level: 1 }).style.color).toBe("");
  });
});
