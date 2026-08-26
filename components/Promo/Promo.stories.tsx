import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Promo from "./Promo";

const duckImage = {
  url: "https://images.ctfassets.net/coa0k54bx32t/1KWW7o3ENucoop2XdyejK3/2d376ea9e6b268adb00e9a9e371b292a/Red8-SeasonalOfferings-Hero-061125.avif",
  title: "Red8-SeasonalOfferings-Hero-061125",
  description: "Red 8 seasonal dining offerings",
  width: 1920,
  height: 602,
};

const experienceImage = {
  url: "https://images.ctfassets.net/coa0k54bx32t/2SBpCQONTzXINaiRsbbFzM/75dcdb5315b8c25ef9083d2a061dce36/Experiences-Landing-Page-hero.avif",
  title: "Experiences-Landing-Page-hero",
  description: "Guests enjoying the resort experience",
  width: 1920,
  height: 602,
};

const meta = {
  title: "Components/Promo",
  component: Promo,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    imagePosition: { control: { type: "radio" }, options: ["left", "right"] },
  },
} satisfies Meta<typeof Promo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ImageLeft: Story = {
  args: {
    image: duckImage,
    title: "Peking Duck Special",
    description:
      "Wednesday through Friday\n\nIndulge in our signature Peking Duck, available every Wednesday through Friday.\n\nWhole Duck $88.88 | Half Duck $45.88",
    ctaLabel: "Make a Reservation",
    ctaUrl: "#",
    imagePosition: "left",
  },
};

export const ImageRight: Story = {
  args: {
    image: experienceImage,
    title: "Dim Sum Sundays",
    description:
      "Every Sunday\n\nHalf price Dim Sum, including Steamed Barbecue Pork Buns, Crispy Vegetable Spring Rolls, Steamed Shrimp & Pork Shu Mai, Crab Rangoon, and more.",
    ctaLabel: "Make a Reservation",
    ctaUrl: "#",
    imagePosition: "right",
  },
};
