import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Hero from "./Hero";

const backgroundImage = {
  url: "https://images.ctfassets.net/coa0k54bx32t/4yg4zHANWbbL4QFfE0kRKC/9f3571a5fbc01d272d7fc93ace780d05/hero-banner-1.png",
  title: "hero-banner-1",
  description: "Waterfront resort at dusk",
  width: 2238,
  height: 702,
};

const backgroundImage2 = {
  url: "https://images.ctfassets.net/coa0k54bx32t/73lIvmNPsO5QsUAgDpV4Qn/94fb8febe1b54ea4ebed4d2d09f2916f/hero-banner-2.png",
  title: "hero-banner-2",
  description: "Waterfront resort at dusk",
  width: 2238,
  height: 702,
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
    backgroundImage: backgroundImage2,
    textJustification: "right",
  },
};
