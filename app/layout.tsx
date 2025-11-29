import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/hooks/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/modals/modal-providers";
import { GlobalLoadingProvider } from "@/components/providers/global-loading-provider";
import { BanCheck } from "@/components/auth/ban-check";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sparky Board: Real Time Whiteboard",
  description: "Sparky Board: Real Time Whiteboard",
  icons: {
    icon: '/vercel.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Toaster />
          <ConvexClientProvider>
            <ModalProvider />
            <GlobalLoadingProvider>
              <BanCheck>
                {children}
              </BanCheck>
            </GlobalLoadingProvider>
          </ConvexClientProvider>

        </ClerkProvider>
      </body>
    </html>
  );
}
