import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BaseHeading from "./BaseHeading";

const meta = {
  title: "Components/BaseHeading",
  component: BaseHeading,
  argTypes: {
    level: { control: { type: "select" }, options: [1, 2, 3, 4, 5, 6] },
    textAlign: { control: { type: "radio" }, options: ["left", "center", "right"] },
    color: { control: "color" },
  },
} satisfies Meta<typeof BaseHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    level: 1,
    children: "Escape to Encore Boston Harbor",
  },
};

export const Heading2: Story = {
  args: {
    level: 2,
    children: "A Waterfront Resort Experience",
  },
};

export const Heading3: Story = {
  args: {
    level: 3,
    children: "Seasonal Offerings",
  },
};

export const CenteredWithColor: Story = {
  args: {
    level: 1,
    children: "Centered Gold Heading",
    textAlign: "center",
    color: "#775c3d",
  },
};

export const RightAligned: Story = {
  args: {
    level: 2,
    children: "Right Aligned Subheading",
    textAlign: "right",
  },
};

export const AllLevels: Story = {
  args: {
    level: 1,
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <BaseHeading level={1}>Heading level 1</BaseHeading>
      <BaseHeading level={2}>Heading level 2</BaseHeading>
      <BaseHeading level={3}>Heading level 3</BaseHeading>
      <BaseHeading level={4}>Heading level 4</BaseHeading>
      <BaseHeading level={5}>Heading level 5</BaseHeading>
      <BaseHeading level={6}>Heading level 6</BaseHeading>
    </div>
  ),
};
