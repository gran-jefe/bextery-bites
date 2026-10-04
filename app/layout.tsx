import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://bexterybites.com.ng"),
  title: {
    default: "Bextery Bites | Premier Cake Shop & Healthy Pastries in Ibadan",
    template: "%s | Bextery Bites - Cake Shop Ibadan",
  },
  description:
    "Artisanal cake shop and bakery in Ibadan. Order handcrafted celebration cakes, foil cakes, parfaits, and dietitian-formulated clinical pastries. Fresh, 100% Halal, and delivered in Ibadan.",
  keywords: [
    "cake shop ibadan",
    "cake shops in ibadan",
    "cakes ibadan",
    "bakery in ibadan",
    "bextery bites",
    "bextery bites cake shop",
    "foil cake ibadan",
    "best cake shop ibadan",
    "birthday cake ibadan",
    "custom cakes ibadan",
    "parfait in ibadan",
    "red velvet cake ibadan",
    "diabetic cake nigeria",
    "healthy pastries ibadan",
    "dietitian baker nigeria",
  ],
  authors: [{ name: "Bextery Bites" }],
  creator: "Bextery Bites",
  publisher: "Bextery Bites",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://bexterybites.com.ng",
    siteName: "Bextery Bites Cake Shop",
    title: "Bextery Bites | Premier Cake Shop & Healthy Pastries in Ibadan",
    description:
      "Artisanal cake shop and bakery in Ibadan. Handcrafted celebration cakes, foil cakes, parfaits, and nutritious treats made to order.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bextery Bites - Artisanal Cake Shop and Bakery in Ibadan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bextery_bites",
    creator: "@bextery_bites",
    title: "Bextery Bites | Premier Cake Shop & Healthy Pastries in Ibadan",
    description:
      "Artisanal cake shop and bakery in Ibadan. Handcrafted celebration cakes, foil cakes, parfaits, and nutritious treats made to order.",
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
              "@context": "https://schema.org",
              "@type": "Bakery",
              name: "Bextery Bites",
              alternateName: [
                "Bextery Bites Cake Shop",
                "Bextery Bites Bakery",
                "Bextery Bites Ibadan",
              ],
              url: "https://bexterybites.com.ng",
              logo: "https://bexterybites.com.ng/brand-real-logo-colored.png",
              image: "https://bexterybites.com.ng/og-image.jpg",
              description:
                "Artisanal cake shop and bakery in Ibadan specializing in handcrafted celebration cakes, foil cakes, parfaits, and clinical nutrition pastries.",
              telephone: "+2347067436817",
              priceRange: "₦₦",
              servesCuisine: ["Bakery", "Cakes", "Desserts", "Pastries"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ibadan",
                addressRegion: "Oyo State",
                addressCountry: "NG",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 7.3775,
                longitude: 3.947,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "08:00",
                  closes: "20:00",
                },
              ],
              sameAs: [
                "https://instagram.com/_bexterybites",
                "https://www.tiktok.com/@bextery.bites",
                "https://x.com/bextery_bites",
              ],
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
