import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { neobrutalism } from "@clerk/themes";

import "./globals.css";
import { ViewTransitions } from "next-view-transitions";

import { Toaster } from "@/components/ui/toaster";

import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Split Billing System",
  description: "PWA to split your bills",
  icons: {
    icon: [
      { url: "/icon512_maskable.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </ViewTransitions>
  );
}
