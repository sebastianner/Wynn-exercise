import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Header from "./Header";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

const logo = {
  url: "https://images.ctfassets.net/coa0k54bx32t/4tKbJto9rZLzis0iPiR94m/4dfe497d7cc4d09d203d5c77fbc70ae4/Animated-Web-Logo-NoLoop.gif",
  title: "Encore Boston Harbor logo",
  width: 201,
  height: 91,
};

const navigationItems = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
];

export const Default: Story = {
  args: {
    logo,
    siteName: "Acme Inc.",
    navigationItems,
  },
};
