import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://bexterybites.com.ng"),
  title: {
    default: "Bextery Bites: Sumptuous Taste & Clinical Nutrition | Ibadan",
    template: "%s | Bextery Bites",
  },
  description:
    "Handcrafted cakes, foil cakes, parfaits, and clinical nutrition pastries in Ibadan. Formulated by a Human Nutrition & Dietetics professional. 100% Halal & Pure.",
  keywords: [
    "cakes ibadan",
    "foil cake ibadan",
    "diabetic cake nigeria",
    "healthy pastries ibadan",
    "parfait in ibadan",
    "red velvet cake ibadan",
    "bextery bites",
    "dietitian baker nigeria",
  ],
  authors: [{ name: "Bextery Bites" }],
  creator: "Bextery Bites",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://bexterybites.com.ng",
    siteName: "Bextery Bites",
    title: "Bextery Bites: Sumptuous feel in every nutritious bite",
    description: "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bextery Bites - Handcrafted Pastries in Ibadan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bextery_bites",
    creator: "@bextery_bites",
    title: "Bextery Bites: Sumptuous feel in every nutritious bite",
    description: "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="canonical" href="https://bexterybites.com.ng" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "LocalBusiness",
              name: "Bextery Bites",
              image: "https://bexterybites.com.ng/brand-logo-full.jpg",
              description:
                "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order.",
              telephone: "+2347067436817",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ibadan",
                addressRegion: "Oyo State",
                addressCountry: "NG",
              },
              sameAs: ["https://x.com/bextery_bites"],
              priceRange: "₦₦",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
