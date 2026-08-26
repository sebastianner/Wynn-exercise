import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import UtilityBar from "./UtilityBar";

describe("UtilityBar", () => {
  it("renders the sign in and join rewards links", () => {
    render(<UtilityBar />);

    expect(screen.getByRole("button", { name: /Sign In/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join Wynn Rewards/ })).toBeInTheDocument();
  });

  it("opens the search input and lets the user type and submit without navigating away", async () => {
    const user = userEvent.setup();
    render(<UtilityBar />);

    const toggle = screen.getByRole("button", { name: "Open search" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Close search" })).toHaveAttribute("aria-expanded", "true");

    const searchInput = screen.getByRole("searchbox", { name: "Search" });
    await user.type(searchInput, "spa");
    expect(searchInput).toHaveValue("spa");

    await user.type(searchInput, "{Enter}");

    expect(searchInput).toBeInTheDocument();
  });

  it("closes the search input when the user clicks outside the bar", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <UtilityBar />
        <p>Outside content</p>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Open search" }));
    expect(screen.getByRole("button", { name: "Close search" })).toBeInTheDocument();

    await user.click(screen.getByText("Outside content"));

    expect(screen.getByRole("button", { name: "Open search" })).toBeInTheDocument();
  });
});
