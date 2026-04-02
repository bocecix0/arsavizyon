import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArsaVizyon — Arsanızın Geleceğini Görün",
  description:
    "AI ile saniyeler içinde profesyonel bina görseli ve inşaat videosu. Fotoğraf yükle, 30 saniyede profesyonel render al.",
  keywords: ["arsa görselleştirme", "yapı render", "AI mimari", "inşaat videosu"],
  openGraph: {
    title: "ArsaVizyon — Arsanızın Geleceğini Görün",
    description: "AI ile saniyeler içinde profesyonel bina görseli ve inşaat videosu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans bg-background text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
