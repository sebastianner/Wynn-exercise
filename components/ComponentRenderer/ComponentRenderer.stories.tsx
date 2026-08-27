import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { PageComponent } from "@/types/content-types";

import ComponentRenderer from "./ComponentRenderer";

// Mirrors the real shape of a resolved Contentful "page" entry's
// `components` field (fetched with `include` deep enough to resolve links).
const homePageComponents: PageComponent[] = [
  {
    id: "5KlOXAY0q40oUBI9glm3Y6",
    contentType: "hero",
    heading: "Build Something Amazing",
    subheading: "The platform trusted by thousands of teams worldwide.",
    backgroundImage: {
      url: "https://images.ctfassets.net/coa0k54bx32t/4yg4zHANWbbL4QFfE0kRKC/9f3571a5fbc01d272d7fc93ace780d05/hero-banner-1.png",
      title: "hero-banner-1",
      width: 2238,
      height: 702,
    },
    textJustification: "left",
  },
  {
    id: "7gcXSN16dQ26zDunyc15Qe",
    contentType: "promo",
    title: "Limited Time Offer",
    description: "Save 20% on your first purchase when you sign up today.",
    ctaLabel: "Shop Now",
    ctaUrl: "/shop",
    imagePosition: "left",
    image: {
      url: "https://images.ctfassets.net/coa0k54bx32t/7uVghguv2ydFjlBwSIzXjE/65fe5134b1cf2fb050a8d96b4a487493/Red8-Peking-Duck-Braga-828x466.avif",
      title: "Red8-Peking-Duck-Braga-828x466",
      width: 828,
      height: 466,
    },
  },
];

const meta = {
  title: "Components/ComponentRenderer",
  component: ComponentRenderer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ComponentRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HomePage: Story = {
  args: {
    components: homePageComponents,
  },
};

export const Empty: Story = {
  args: {
    components: [],
  },
};
