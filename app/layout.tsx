import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getFooter, getHeader, getNavigation } from "@/lib/contentful";

import DesktopNavigation from "@/components/DesktopNavigation/DesktopNavigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import UtilityBar from "@/components/UtilityBar/UtilityBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insight Global",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [header, footer, navigation] = await Promise.all([getHeader(), getFooter(), getNavigation()]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {header && (
          <div className="tw:sticky tw:top-0 tw:z-50">
            <UtilityBar />
            <Header logo={header.logo} siteName={header.siteName} navigationItems={navigation?.items ?? []} />
          </div>
        )}
        <div className="tw:hidden tw:xl:block">
          <DesktopNavigation items={navigation?.items ?? []} />
        </div>
        <main className="flex-1">{children}</main>
        {footer && (
          <Footer
            linkGroups={footer.linkGroups}
            copyrightText={footer.copyrightText}
            selfExclusionLabel={footer.selfExclusionLabel}
          />
        )}
      </body>
    </html>
  );
}
