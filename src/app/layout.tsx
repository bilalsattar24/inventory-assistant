import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amazon Inventory Assistant | Optimize Your FBA Business",
  description:
    "Make data-driven restocking decisions and never run out of inventory again. Perfect timing, optimal quantities, maximum profits for Amazon sellers.",
  openGraph: {
    title: "Amazon Inventory Assistant",
    description:
      "Make data-driven restocking decisions and never run out of inventory again. Perfect timing, optimal quantities, maximum profits for Amazon sellers.",
    type: "website",
    images: [
      {
        url: "/landing-preview.jpg", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Amazon Inventory Assistant Landing Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Inventory Assistant",
    description:
      "Make data-driven restocking decisions and never run out of inventory again. Perfect timing, optimal quantities, maximum profits for Amazon sellers.",
    images: ["/landing-preview.jpg"], // Same image as OpenGraph
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Optimize your Amazon inventory management with our dynamic tool that calculates order dates, quantities, and shipping schedules based on sales forecasts and inventory levels."
        />
        <meta
          name="keywords"
          content="Amazon, inventory management, order management, sales forecasting, FBA"
        />
        <meta name="author" content="Your Name or Company" />
        <meta property="og:title" content="Amazon Inventory Management Tool" />
        <meta
          property="og:description"
          content="A powerful tool to help Amazon sellers manage their inventory efficiently, ensuring optimal stock levels and timely orders."
        />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Amazon Inventory Management Tool" />
        <meta
          name="twitter:description"
          content="A powerful tool to help Amazon sellers manage their inventory efficiently, ensuring optimal stock levels and timely orders."
        />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
