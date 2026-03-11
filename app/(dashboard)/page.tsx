"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Footer from "@/components/UI/Footer";

export default function Page() {

return (
<>
<DashboardStats/>

<div className="px-6 mt-6">
<DashboardCharts/>
</div>

<Footer/>
</>
);

}