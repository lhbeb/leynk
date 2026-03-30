import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import DevTools from "@/components/DevTools";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Leynk - Link in Bio",
  description: "Create your personalized link in bio page",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`} suppressHydrationWarning>
        {children}
        <DevTools />
      </body>
    </html>
  );
}

