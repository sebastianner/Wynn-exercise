import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Footer from "./Footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    linkGroups: [
      [
        { url: "/shop-home-collection", name: "Shop Home Collection" },
        { url: "/gift-cards", name: "Gift Cards" },
        { url: "/encore-boston-harbor-shops", name: "Encore Boston Harbor Shops" },
        { url: "/harborwalk", name: "Harborwalk" },
        { url: "/wynn-stories", name: "Wynn Stories" },
        { url: "/wynn-slots-app", name: "Wynn Slots App" },
      ],
      [
        { url: "/about-us", name: "About Us" },
        { url: "/careers", name: "Careers" },
        { url: "/investor-relations", name: "Investor Relations" },
        { url: "/press-room", name: "Press Room" },
        { url: "/community", name: "Community" },
        { url: "/vendors", name: "Vendors" },
      ],
      [
        { url: "/privacy-notice", name: "Privacy Notice" },
        { url: "/cookie-notice", name: "Cookie Notice" },
        { url: "/terms-of-use", name: "Terms of Use" },
        { url: "/hotel-information", name: "Hotel Information" },
        { url: "/lost-and-found", name: "Lost and Found" },
        { url: "/accessibility", name: "Accessibility" },
      ],
      [
        { url: "/wynn-resorts", name: "Wynn Resorts" },
        { url: "/wynn-las-vegas", name: "Wynn Las Vegas" },
        { url: "/wynn-palace-cotai", name: "Wynn Palace Cotai" },
        { url: "/wynn-macau", name: "Wynn Macau" },
        { url: "/wynn-al-marjan-island", name: "Wynn Al Marjan Island" },
        { url: "/wynn-mayfair", name: "Wynn Mayfair" },
      ],
    ],
    copyrightText: "© 2026 Encore Boston Harbor. All rights reserved.",
    selfExclusionLabel:
      "If you or a loved one is experiencing problems with gambling and needs support, call (800) 327-5050 or visit maproblemgamblinghelpline.org to speak with a trained Specialist. Specialists are available 24/7 and services are free, confidential, and available in multiple languages.",
  },
};

export const Empty: Story = {
  args: {
    linkGroups: [],
    copyrightText: "© 2026 Encore Boston Harbor. All rights reserved.",
    selfExclusionLabel:
      "If you or a loved one is experiencing problems with gambling and needs support, call (800) 327-5050 or visit maproblemgamblinghelpline.org to speak with a trained Specialist. Specialists are available 24/7 and services are free, confidential, and available in multiple languages.",
  },
};
