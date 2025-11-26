import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/hooks/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/modals/modal-providers";


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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Toaster />
          <ConvexClientProvider>
          <ModalProvider />
           {/* <LiveblocksProvider publicApiKey={"pk_dev_5B_GzeVdCkI-sCVT7hzMOsz4HtLH9j50AiymMBL1OhiO3Bw87Smzv-hof5hQYbda"}> */}
            {children}
            {/* </LiveblocksProvider> */}
            </ConvexClientProvider>
          
        </ClerkProvider>
      </body>
    </html>
  );
}
