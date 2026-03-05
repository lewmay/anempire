import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import StructuredData from "@/components/seo/StructuredData";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/structured-data";
import { seoConfig } from "@/content/seo";

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.site.url),
  title: {
    default: seoConfig.site.name,
    template: `%s`,
  },
  description: seoConfig.site.description,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <meta name="theme-color" content="#262626" />
      </head>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
