"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Footer from "@/components/UI/Footer";

export default function Page() {

return (
<>
<DashboardStats/>

<div className="px-4 lg:px-6 mt-4 lg:mt-6">
<DashboardCharts/>
</div>

<Footer/>
</>
);

}