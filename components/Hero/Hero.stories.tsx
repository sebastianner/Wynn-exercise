import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Hero from "./Hero";

const backgroundImage = {
  url: "/hero-placeholder.jpg",
  title: "Waterfront resort at dusk",
  description: "Waterfront resort at dusk",
};

const meta = {
  title: "Components/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    textJustification: { control: { type: "radio" }, options: ["left", "center", "right"] },
  },
} satisfies Meta<typeof Hero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LeftJustified: Story = {
  args: {
    heading: "Escape to Encore Boston Harbor",
    subheading: "A waterfront resort experience unlike any other",
    backgroundImage,
    textJustification: "left",
  },
};

export const CenterJustified: Story = {
  args: {
    heading: "Escape to Encore Boston Harbor",
    subheading: "A waterfront resort experience unlike any other",
    backgroundImage,
    textJustification: "center",
  },
};

export const RightJustified: Story = {
  args: {
    heading: "Escape to Encore Boston Harbor",
    subheading: "A waterfront resort experience unlike any other",
    backgroundImage,
    textJustification: "right",
  },
};
