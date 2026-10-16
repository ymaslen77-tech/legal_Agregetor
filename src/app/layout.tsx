import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { ChromeFrame } from "@/components/ChromeFrame";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { platformContacts } from "@/lib/platform";
import { siteUrl } from "@/lib/seo";

/** Respect the actual device CSS viewport; never shrink text to a desktop canvas. */
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "ПравоПоиск - юридический навигатор для граждан",
    template: "%s | ПравоПоиск"
  },
  description: "ПравоПоиск помогает определить юридическую ситуацию, проверить сроки и риски, подготовить документы и подключить юриста, если без него нельзя.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "ПравоПоиск - юридический навигатор для граждан",
    description:
      "Определим вашу ситуацию, покажем сроки и риски, подготовим документы и подключим юриста, если без него нельзя.",
    url: siteUrl(),
    siteName: "ПравоПоиск",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: `${siteUrl()}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "ПравоПоиск — юридический навигатор для граждан"
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION
  },
  other: {
    "geo.region": "RU",
    "geo.placename": platformContacts.yandexRegion,
    "yandex-region": platformContacts.yandexRegion
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AnalyticsConsent />
        <ChromeFrame header={<Header />} footer={<Footer />}>
          {children}
        </ChromeFrame>
      </body>
    </html>
  );
}
