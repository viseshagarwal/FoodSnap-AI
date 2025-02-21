"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "./pwa";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      
      // Add event listeners
      wb.addEventListener('installed', (event) => {
        console.log('Service Worker installed');
      });

      wb.addEventListener('activated', (event) => {
        console.log('Service Worker activated');
      });

      wb.addEventListener('controlling', (event) => {
        console.log('Service Worker controlling');
      });

      // Register the service worker
      wb.register();
    }

    // Handle mouse movement for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <>{children}</>;
}
