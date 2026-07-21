import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Yashmit Singh — Builder's OS",
  description:
    "Yashmit Singh is a computer-science student building explainable machine-learning systems and the product infrastructure around them.",
  applicationName: "Yashmit Singh Portfolio",
  authors: [{ name: "Yashmit Singh" }],
  creator: "Yashmit Singh",
  keywords: ["Yashmit Singh", "machine learning", "explainable AI", "computer vision", "FastAPI", "Next.js"],
  openGraph: {
    type: "profile",
    title: "Yashmit Singh - From model accuracy to useful decisions",
    description: "Explainable AI, real-time computer vision, and product engineering.",
    firstName: "Yashmit",
    lastName: "Singh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yashmit Singh - From model accuracy to useful decisions",
    description: "Explainable AI, real-time computer vision, and product engineering.",
  },
  robots: { index: true, follow: true },
  ...(siteUrl
    ? {
        metadataBase: new URL(siteUrl),
        alternates: { canonical: "/" },
      }
    : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
