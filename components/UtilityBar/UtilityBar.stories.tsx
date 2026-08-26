import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import UtilityBar from "./UtilityBar";

const meta = {
  title: "Components/UtilityBar",
  component: UtilityBar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof UtilityBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
