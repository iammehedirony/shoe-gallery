import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/lib/query/query-client";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import { ToastProvider } from "@/src/contexts/ToastContext";
import SplashScreenWrapper from "@/src/components/ui/SplashScreenWrapper";
import SearchModal from "@/src/components/ui/SearchModal";
import MobileSidebar from "@/src/components/ui/MobileSidebar";

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
          <ToastProvider>
            <SplashScreenWrapper />
            <QueryProvider>
              {children}
              <SearchModal />
              <MobileSidebar />
            </QueryProvider>
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
