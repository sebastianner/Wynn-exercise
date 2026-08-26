import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MobileNavigation from "./MobileNavigation";

const meta = {
  title: "Components/MobileNavigation",
  component: MobileNavigation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MobileNavigation>;

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
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
