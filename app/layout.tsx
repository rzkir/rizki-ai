import type { Metadata } from "next";

import "@/helper/style/globals.css";

import { geistSans, geistMono } from "@/helper/fonts/Fonts";

import Providers from "@/helper/routing/Provider";

import Pathname from "@/helper/routing/Pathname";

import { defaultMetadata } from "@/helper/meta/Metadata";

import { sitelinksJsonLd, organizationJsonLd } from "@/helper/breadchumb/Script";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}