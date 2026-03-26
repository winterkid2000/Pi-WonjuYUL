import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pi-WonjuYUL",
  description: "Pyramid imaging dashboard frontend demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Pi-WonjuYUL",
  description: "Pyramid imaging dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};
