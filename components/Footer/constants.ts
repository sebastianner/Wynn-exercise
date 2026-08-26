import facebookIcon from "@/assets/icons/facebook.svg";
import instagramIcon from "@/assets/icons/instagram.svg";
import tiktokIcon from "@/assets/icons/tiktok.svg";

export const FOOTER_TEXT = {
  hotelName: "Encore Boston Harbor",
  addressLine1: "One Broadway,",
  addressLine2: "Everett, MA 02149",
  phone: "+1 (857) 770-7000",
  phoneHref: "+18577707000",
  connectWithUs: "Connect with us.",
} as const;

// Static example data — not sourced from Contentful.
export const SOCIAL_LINKS = [
  { name: "Facebook", url: "#", icon: facebookIcon },
  { name: "Instagram", url: "#", icon: instagramIcon },
  { name: "TikTok", url: "#", icon: tiktokIcon },
];
