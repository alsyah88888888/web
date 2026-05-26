import type { Metadata } from "next";
import localFont from "next/font/local";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Riansyah Lubis | Portfolio",
  description: "Multimedia Specialist Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}
        style={{
          // Opsional: Menambahkan variabel ukuran teks kustom jika ingin diatur dari sini
          // @ts-ignore
          "--hero-title-size": "clamp(3rem, 10vw, 8rem)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
