import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Primus Dashboard",
  description: " Primus School Automation",
};


export default async function RootLayout({
  children,
   header ,
   sidebar,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
}>) {

  return (
      <main
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {header}
        {sidebar}
      <div className="absolute left-50 top-17 right-0 overflow-y-scroll overflow-x-hidden">
          {children}
          </div>
       </main>
  );
}
