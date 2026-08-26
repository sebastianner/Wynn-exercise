import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// next/font/google relies on Next's SWC compiler, which isn't available in
// this plain Vite-powered unit test project — stub every font loader with a
// no-op so components using it render without a real Next.js build.
vi.mock("next/font/google", () => {
  const fontLoader = () => ({ className: "", variable: "", style: {} });
  return {
    Geist: fontLoader,
    Geist_Mono: fontLoader,
    Playfair_Display: fontLoader,
  };
});

afterEach(() => {
  cleanup();
});
