

import { Geist, Geist_Mono } from "next/font/google";

import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import Settings from "@/app/models/Settings";
import { connectDB } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Admin from "../models/Admin";
import Header from "@/components/UI/Header";
import SideBar from "@/components/UI/SideBar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Primus Dashboard",
  description: " Primus School Automation",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { schoolId } = await verifyAuth();

  await connectDB();

  const pathname = (await headers()).get("x-pathname") ?? "";

const activeSessionData = await AcademicSession.findOne({
  schoolId,
  isActive: true,
});

const settings = await Settings.findOne({ schoolId });

const admin = await Admin.findOne({schoolId});

const isSetupRoute =
  pathname.startsWith("/academic-session") ||
  pathname.startsWith("/settings-setup");

if (!admin.hasCompletedSetup) {
  // 1️⃣ Academic session guard
if (!activeSessionData && !isSetupRoute) {
  redirect("/academic-session");
}

// 2️⃣ Settings guard (ONLY after session exists)
if (activeSessionData && (!settings || !settings.settingsCompleted) && !isSetupRoute) {
  redirect("/settings-setup");
}

} 
  return (
      <main
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <SideBar/>
        <div className="lg:ml-50 mt-17 lg:mt-17 p-4 lg:p-6 overflow-y-auto overflow-x-hidden min-h-screen">
          {children}
        </div>
       </main>
  );
}
