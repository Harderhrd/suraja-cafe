import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://surajacafe.vercel.app"),
  title: "Suraja Cafè Vegan | Ristorante Vegano Arcore - Monza Brianza",
  description:
    "Scopri Suraja Cafè Vegan ad Arcore (MB). Colazione vegana, pranzi, apericena e dolci 100% vegetali. Il gusto del benessere in Brianza.",
  keywords: [
    "ristorante vegano Arcore",
    "caffè vegano Arcore",
    "colazione vegana Monza",
    "dolci vegani Arcore",
    "apericena vegana Brianza",
    "cucina vegetale Arcore",
    "vegan cafe Monza Brianza",
  ],
  openGraph: {
    title: "Suraja Cafè Vegan | Ristorante Vegano Arcore - Monza Brianza",
    description:
      "Scopri Suraja Cafè Vegan ad Arcore (MB). Colazione vegana, pranzi, apericena e dolci 100% vegetali. Il gusto del benessere in Brianza.",
    images: ["/images/og-image.jpg"],
    locale: "it_IT",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Suraja Cafè Vegan",
  servesCuisine: "Vegan",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Roma, 4",
    addressLocality: "Arcore",
    addressRegion: "MB",
    postalCode: "20862",
    addressCountry: "IT",
  },
  telephone: "039 265 1629",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.6,
    reviewCount: 138,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
