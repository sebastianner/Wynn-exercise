import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BaseButton from "./BaseButton";

const meta = {
  title: "Components/BaseButton",
  component: BaseButton,
} satisfies Meta<typeof BaseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AsButton: Story = {
  args: {
    children: "Check Availability",
  },
};

export const AsLink: Story = {
  args: {
    children: "Make a Reservation",
    href: "#",
  },
};
