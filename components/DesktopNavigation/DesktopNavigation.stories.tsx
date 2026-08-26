import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DesktopNavigation from "./DesktopNavigation";

const meta = {
  title: "Components/DesktopNavigation",
  component: DesktopNavigation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DesktopNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { name: "Rooms & Suites", url: "/rooms-suites" },
      { name: "Dining", url: "/dining" },
      { name: "Casino", url: "/casino" },
      { name: "Wynn Rewards", url: "/wynn-rewards" },
      { name: "Casino Promotions", url: "/casino-promotions" },
      { name: "Experiences", url: "/experiences" },
      { name: "Amenities", url: "/amenities" },
      { name: "Transportation", url: "/transportation" },
      { name: "Meetings & Events", url: "/meetings-events" },
    ],
    activeUrl: "/experiences",
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
