import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import { metadata } from "./metadata";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body 
        className={`${inter.className} min-h-screen antialiased`}
        style={{
          background: 'linear-gradient(135deg, rgba(238,242,255,0.6) 0%, rgba(255,255,255,1) 50%, rgba(253,242,255,0.6) 100%)'
        }}
      >
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
