import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import BaseButton from "./BaseButton";

describe("BaseButton", () => {
  it("renders as a button by default", () => {
    render(<BaseButton>Click me</BaseButton>);

    expect(screen.getByRole("button", { name: "Click me" })).toHaveAttribute("type", "button");
  });

  it("renders as a link when href is given", () => {
    render(<BaseButton href="/reserve">Reserve</BaseButton>);

    expect(screen.getByRole("link", { name: "Reserve" })).toHaveAttribute("href", "/reserve");
  });

  it("calls onClick when the button variant is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BaseButton onClick={onClick}>Click me</BaseButton>);

    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when the link variant is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <BaseButton href="/reserve" onClick={onClick}>
        Reserve
      </BaseButton>,
    );

    await user.click(screen.getByRole("link", { name: "Reserve" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("submits an enclosing form when type is submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <BaseButton type="submit">Submit</BaseButton>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
