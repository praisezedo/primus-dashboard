"use client";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardStats from "@/components/dashboard/DashboardStats";
import Footer from "@/components/UI/Footer";

export default function Page() {
   return <>
    <DashboardStats/>
    <div className="w-full px-6">
      <DashboardCharts/>
    </div>
    <Footer/>
   </>
}