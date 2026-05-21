import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Bextery Bites — Sumptuous feel in every nutritious bite",
    template: "%s | Bextery Bites",
  },
  description:
    "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order. Order via WhatsApp.",
  keywords: [
    "cakes ibadan",
    "pastries ibadan",
    "custom cakes nigeria",
    "bextery bites",
    "order cake whatsapp ibadan",
  ],
  authors: [{ name: "Bextery Bites" }],
  creator: "Bextery Bites",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://bexterybites.com.ng",
    siteName: "Bextery Bites",
    title: "Bextery Bites — Sumptuous feel in every nutritious bite",
    description: "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bextery Bites — Handcrafted Pastries in Ibadan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bextery_bites",
    creator: "@bextery_bites",
    title: "Bextery Bites — Sumptuous feel in every nutritious bite",
    description: "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order.",
    images: ["/og-image.jpg"],
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
              image: "https://bexterybites.com.ng/logo-full.svg",
              description:
                "Handcrafted cakes and pastries in Ibadan. Nutritious, moist, and made to order.",
              telephone: "+2348089480850",
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
