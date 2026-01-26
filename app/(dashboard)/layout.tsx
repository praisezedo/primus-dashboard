
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import Settings from "@/app/models/Settings";
import { connectDB } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
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

  const { schoolId } = await verifyAuth();
  await connectDB();

  const pathname = (await headers()).get("x-pathname") ?? "";

  const activeSession = await AcademicSession.findOne({
    schoolId,
    isActive: true,
  });

// 1 Academic session gate
if (
  !activeSession &&
  !pathname.startsWith("/academic-session")
) {
  redirect("/academic-session");
}


const settings = await Settings.findOne({ schoolId });

// 2 settings gate (ONLY AFTER session exists)
if (
  activeSession &&
  (!settings || !settings.settingsCompleted) &&
  !pathname.startsWith("/settings-setup")
) {
  redirect("/settings-setup");
}

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
