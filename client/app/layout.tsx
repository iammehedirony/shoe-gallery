import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JH SHOE GALLERY | Premium Shoes & Lifestyle",
  description:
    "Shop premium leather shoes, sneakers, loafers and accessories for men and women at JH SHOE GALLERY.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
