import { Analytics } from '@vercel/analytics/react';
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Chatbot from '@/components/chatbot';
import { GoogleAnalytics } from '@next/third-parties/google';
import { AOSInit } from '@/components/aos-init';
import { TooltipProvider } from '@/components/ui/tooltip';
import { constructMetadata } from '@/lib/construct-metadata';

import { SessionWrapper } from "@/components/providers/SessionWrapper";  // ✅ Import the wrapper

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <AOSInit />
      <body
        id='root'
        className={cn(
          "min-h-screen w-full bg-white font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        {/* ✅ Wrap with SessionWrapper */}
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              {children}
              <Toaster />
              {process.env.VERCEL_ENV === "production" ? <Analytics /> : null}
            </TooltipProvider>
          </ThemeProvider>
        </SessionWrapper>

        <Chatbot />
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID || ''} />
    </html>
  );
}
