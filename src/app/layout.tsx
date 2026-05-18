import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majun Admin",
  description: "Sistem administrasi usaha kain majun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
