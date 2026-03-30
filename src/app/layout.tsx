import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Here2Next NextGen - Startup & Kurum İşbirliği Platformu",
  description:
    "Here2Next üyeleri için startup-kurum işbirliğini kolaylaştıran platform. Keşfet, eşleş, büyü.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`h-full antialiased ${poppins.variable}`}>
      <body
        className="min-h-full flex flex-col bg-white"
        style={{ fontFamily: "var(--font-poppins), 'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif" }}
      >
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
