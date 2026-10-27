import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/lib/query/query-client";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import SplashScreenWrapper from "@/src/components/ui/SplashScreenWrapper";

export const metadata: Metadata = {
  title: "JH SHOE GALLERY | Premium Shoes & Lifestyle",
  description:
    "Shop premium leather shoes, sneakers, loafers and accessories for men and women at JH SHOE GALLERY.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-ink">
        <LoadingProvider>
          <SplashScreenWrapper />
          <QueryProvider>{children}</QueryProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
