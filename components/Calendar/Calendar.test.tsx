import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useReservationStore } from "@/lib/store/reservationStore";

import Calendar from "./Calendar";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = startOfDay(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

const today = startOfDay(new Date());

function checkInBox() {
  return screen.getByRole("button", { name: new RegExp(`^Check In, `) });
}

function checkOutBox() {
  return screen.getByRole("button", { name: new RegExp(`^Check Out, `) });
}

describe("Calendar", () => {
  beforeEach(() => {
    useReservationStore.getState().reset();
  });

  it("defaults to a 3-night stay starting today, with check-in active", () => {
    render(<Calendar />);

    expect(screen.getByText(formatShortDate(today))).toBeInTheDocument();
    expect(screen.getByText(formatShortDate(addDays(today, 3)))).toBeInTheDocument();
    expect(checkInBox()).toHaveAttribute("aria-pressed", "true");
    expect(checkOutBox()).toHaveAttribute("aria-pressed", "false");
  });

  it("disables days before today", () => {
    render(<Calendar />);

    if (today.getDate() > 1) {
      const pastDay = addDays(today, -1);
      expect(screen.getByRole("button", { name: formatDayLabel(pastDay) })).toBeDisabled();
    }
  });

  it("picks a new check-in with a single click and advances to check-out", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const futureDay = addDays(today, 10);
    await user.click(screen.getByRole("button", { name: formatDayLabel(futureDay) }));

    expect(screen.getByText(formatShortDate(futureDay))).toBeInTheDocument();
    expect(screen.getByText("Select a date")).toBeInTheDocument();
    expect(checkOutBox()).toHaveAttribute("aria-pressed", "true");
  });

  it("completes the range by picking a checkout date after the new check-in", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const newCheckIn = addDays(today, 10);
    const newCheckOut = addDays(today, 14);

    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckIn) }));
    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckOut) }));

    expect(screen.getByText(formatShortDate(newCheckIn))).toBeInTheDocument();
    expect(screen.getByText(formatShortDate(newCheckOut))).toBeInTheDocument();
  });

  it("rejects a checkout pick that isn't after check-in", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const newCheckIn = addDays(today, 10);
    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckIn) }));
    // Now targeting check-out: clicking check-in's own day again is not a valid checkout.
    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckIn) }));

    expect(screen.getByText("Select a date")).toBeInTheDocument();
  });

  it("lets the user re-target check-in independently after a range is already complete", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    // Default range is already complete (today .. today+3). Re-open check-in and move it later,
    // while it's still before the existing check-out, so check-out is preserved.
    await user.click(checkInBox());
    const newCheckIn = addDays(today, 1);
    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckIn) }));

    expect(screen.getByText(formatShortDate(newCheckIn))).toBeInTheDocument();
    expect(screen.getByText(formatShortDate(addDays(today, 3)))).toBeInTheDocument();
  });

  it("clears check-out when a re-picked check-in would no longer be before it", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    await user.click(checkInBox());
    const laterCheckIn = addDays(today, 10);
    await user.click(screen.getByRole("button", { name: formatDayLabel(laterCheckIn) }));

    expect(screen.getByText(formatShortDate(laterCheckIn))).toBeInTheDocument();
    expect(screen.getByText("Select a date")).toBeInTheDocument();
  });

  it("lets the user target check-out directly by clicking its box", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    expect(checkInBox()).toHaveAttribute("aria-pressed", "true");

    await user.click(checkOutBox());

    expect(checkOutBox()).toHaveAttribute("aria-pressed", "true");
    expect(checkInBox()).toHaveAttribute("aria-pressed", "false");
  });

  it("navigates to the next month and only then allows going back", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const prevButton = screen.getByRole("button", { name: "Show previous month" });
    expect(prevButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Show next month" }));

    expect(prevButton).toBeEnabled();

    await user.click(prevButton);

    expect(prevButton).toBeDisabled();
  });

  it("steps the rooms and guests-per-room counters within bounds", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const decreaseRooms = screen.getByRole("button", { name: "Decrease rooms" });
    const increaseRooms = screen.getByRole("button", { name: "Increase rooms" });
    expect(decreaseRooms).toBeDisabled();
    for (let i = 0; i < 8; i++) {
      await user.click(increaseRooms);
    }
    expect(increaseRooms).toBeDisabled();
    await user.click(decreaseRooms);
    expect(increaseRooms).toBeEnabled();

    const decreaseGuests = screen.getByRole("button", { name: "Decrease guests per room" });
    const increaseGuests = screen.getByRole("button", { name: "Increase guests per room" });
    await user.click(increaseGuests);
    await user.click(decreaseGuests);
    await user.click(decreaseGuests);
    expect(decreaseGuests).toBeDisabled();
  });

  it("lets the user type a promo code", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const promoInput = screen.getByLabelText("Promo Code");
    await user.type(promoInput, "SUMMER26");

    expect(promoInput).toHaveValue("SUMMER26");
  });

  it("commits the draft selection to the reservation store and calls onUpdate", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<Calendar onUpdate={onUpdate} />);

    const newCheckIn = addDays(today, 10);
    const newCheckOut = addDays(today, 14);
    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckIn) }));
    await user.click(screen.getByRole("button", { name: formatDayLabel(newCheckOut) }));
    await user.click(screen.getByRole("button", { name: "Increase rooms" }));
    await user.type(screen.getByLabelText("Promo Code"), "SUMMER26");

    await user.click(screen.getByRole("button", { name: "Update" }));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith();
    expect(useReservationStore.getState()).toEqual(
      expect.objectContaining({
        checkIn: newCheckIn,
        checkOut: newCheckOut,
        rooms: 2,
        guestsPerRoom: 2,
        promoCode: "SUMMER26",
      }),
    );
  });

  it("resets the selection back to its defaults and calls onReset", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<Calendar onReset={onReset} />);

    const futureDay = addDays(today, 10);
    await user.click(screen.getByRole("button", { name: formatDayLabel(futureDay) }));
    await user.click(screen.getByRole("button", { name: "Increase rooms" }));
    await user.type(screen.getByLabelText("Promo Code"), "TEST");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText(formatShortDate(today))).toBeInTheDocument();
    expect(screen.getByText(formatShortDate(addDays(today, 3)))).toBeInTheDocument();
    expect(screen.getByLabelText("Promo Code")).toHaveValue("");
    expect(checkInBox()).toHaveAttribute("aria-pressed", "true");
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
