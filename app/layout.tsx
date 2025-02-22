import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodSnap - AI-Powered Daily Calorie Counter",
  description:
    "Track your nutrition with AI. Simply snap a photo of your meal and get instant nutritional information.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
    other: [
      { rel: "apple-touch-icon", url: "/logo.png" },
      { rel: "mask-icon", url: "/favicon.svg", color: "#F97316" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FoodSnap",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen antialiased`}
        style={{
          background:
            "linear-gradient(135deg, rgba(238,242,255,0.6) 0%, rgba(255,255,255,1) 50%, rgba(253,242,255,0.6) 100%)",
        }}
      >
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
