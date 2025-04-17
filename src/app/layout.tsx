import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Minux - The Modular OS for Machines",
  description: "Built by marcetux - for makers, robots, and rebels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className={`font-sans antialiased min-h-screen bg-black text-white`}>
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
