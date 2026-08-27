import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import type { ContentfulAsset } from "@/types/content-types";

import { useReservationStore } from "@/lib/store/reservationStore";

import Header from "./Header";

const logo: ContentfulAsset = {
  url: "https://images.ctfassets.net/space/asset/file/logo.gif",
  title: "Acme Inc. logo",
  width: 201,
  height: 91,
};

const navigationItems = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
];

function formatMonthDayYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

describe("Header", () => {
  beforeEach(() => {
    useReservationStore.getState().reset();
  });

  it("renders the logo and a visible site name label", () => {
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    expect(screen.getAllByRole("img", { name: "Acme Inc." })).not.toHaveLength(0);
    expect(screen.getAllByText("Acme Inc.").length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu button's expanded state", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    const closeButton = screen.getByRole("button", { name: "Close menu" });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
  });

  it("shows the mobile navigation items when the menu is opened", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const nav = screen.getByRole("navigation", { name: "Mobile" });
    for (const item of navigationItems) {
      expect(within(nav).getByRole("link", { name: item.name })).toHaveAttribute("href", item.url);
    }
  });

  it("steps the rooms counter between its minimum and maximum bounds, updating the reservation store", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    const decreaseRooms = screen.getByRole("button", { name: "Decrease rooms" });
    const increaseRooms = screen.getByRole("button", { name: "Increase rooms" });

    expect(decreaseRooms).toBeDisabled();

    for (let i = 0; i < 8; i++) {
      await user.click(increaseRooms);
    }
    expect(increaseRooms).toBeDisabled();
    expect(decreaseRooms).toBeEnabled();
    expect(useReservationStore.getState().rooms).toBe(9);

    await user.click(decreaseRooms);
    expect(increaseRooms).toBeEnabled();
    expect(useReservationStore.getState().rooms).toBe(8);
  });

  it("steps the guests-per-room counter, updating the reservation store", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    const decreaseGuests = screen.getByRole("button", { name: "Decrease guests per room" });
    const increaseGuests = screen.getByRole("button", { name: "Increase guests per room" });

    await user.click(increaseGuests);
    await user.click(decreaseGuests);
    await user.click(decreaseGuests);

    expect(decreaseGuests).toBeDisabled();
    expect(useReservationStore.getState().guestsPerRoom).toBe(1);
  });

  it("writes the promo code to the reservation store as the user types", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    const promoInput = screen.getByLabelText("Promo Code");
    await user.type(promoInput, "SUMMER26");

    expect(promoInput).toHaveValue("SUMMER26");
    expect(useReservationStore.getState().promoCode).toBe("SUMMER26");
  });

  it("renders the static check-availability call to action", () => {
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    expect(screen.getByRole("button", { name: "Check Availability" })).toBeInTheDocument();
  });

  it("falls back to default dimensions when the Contentful asset has none", () => {
    const logoWithoutDimensions: ContentfulAsset = { url: logo.url, title: logo.title };
    render(<Header logo={logoWithoutDimensions} siteName="Acme Inc." navigationItems={navigationItems} />);

    expect(screen.getAllByRole("img", { name: "Acme Inc." })).not.toHaveLength(0);
  });

  it("shows the check-in/check-out dates from the reservation store", () => {
    const { checkIn, checkOut } = useReservationStore.getState();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    expect(screen.getByRole("button", { name: formatMonthDayYear(checkIn) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: formatMonthDayYear(checkOut as Date) })).toBeInTheDocument();
  });

  it("opens the calendar panel from the calendar icon and closes it again", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();

    const calendarIconButton = screen.getAllByRole("button", { name: "Calendar" })[0];
    await user.click(calendarIconButton);

    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();

    await user.click(calendarIconButton);

    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  });

  it("closes the calendar panel when the user clicks outside the header", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />
        <p>Outside content</p>
      </div>,
    );

    await user.click(screen.getAllByRole("button", { name: "Calendar" })[0]);
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();

    await user.click(screen.getByText("Outside content"));

    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  });

  it("opens the calendar panel by clicking the check-in date", async () => {
    const user = userEvent.setup();
    const { checkIn } = useReservationStore.getState();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    await user.click(screen.getByRole("button", { name: formatMonthDayYear(checkIn) }));

    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("opens the calendar panel by clicking the check-out date", async () => {
    const user = userEvent.setup();
    const { checkOut } = useReservationStore.getState();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    await user.click(screen.getByRole("button", { name: formatMonthDayYear(checkOut as Date) }));

    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("reflects the dates the calendar commits to the reservation store, and closes the panel", async () => {
    const user = userEvent.setup();
    render(<Header logo={logo} siteName="Acme Inc." navigationItems={navigationItems} />);

    await user.click(screen.getAllByRole("button", { name: "Calendar" })[0]);
    await user.click(screen.getByRole("button", { name: "Update" }));

    const { checkIn, checkOut } = useReservationStore.getState();
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: formatMonthDayYear(checkIn) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: formatMonthDayYear(checkOut as Date) })).toBeInTheDocument();
  });
});
