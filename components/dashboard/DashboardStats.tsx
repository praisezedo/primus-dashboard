"use client";

import { useEffect, useState } from "react";

import { DashboardOverview } from "../types/dashboard";
import api from "@/lib/axios";
import SkeletonInlineText from "../UI/SkelectonInlineText";
import ExpectedFeesCard from "./ExpectedFeesCard";
import PaidFeesCard from "./PaidFeesCard";
import BalanceFeesCard from "./BalanceFeesCard";
import TotalStatsCard from "./TotalStatsCard";


export default function DashboardStats() {
    const [dashboardOverview , setDashboardOverview] = useState<DashboardOverview | null>({
            totalStudents:0,
            totalExpected:0,
            totalPaid:0,
            totalBalance:0,
            studentsWithDebt:0,
            adminName:""
    });  

    const [ academicSession , setAcademicSession ] = useState<string>("");
    const [semester , setSemester] = useState<string>("");
    const [isLoading , setIsLoading] = useState<boolean>(true);




    useEffect(() => {
        const fetchData = async () => {
            try {
  const [dashboardRes , sessionRes , settingsRes ] = await Promise.all([
                api.get("/api/dashboard/overview"),
                api.get("/api/session/current"),
                api.get("/api/settings/get")
                ]);

            setDashboardOverview(dashboardRes.data);
            setAcademicSession(sessionRes.data.name);
            setSemester(settingsRes.data.semester);

            setIsLoading(false);
            } catch (error: any) {
                console.error(error);
                setIsLoading(false);
            } 
        }; 

        fetchData();
    }, [dashboardOverview , semester , academicSession]);

return (

<>

{/* HEADER — EXACTLY YOUR DESIGN */}

<section className="relative bg-white px-6 py-10 mb-5 border-b border-gray-200 shadow-sm flex flex-col gap-7">

<h1 className="font-bold text-3xl text-black">
Welcome , Admin
{isLoading ?
<SkeletonInlineText length={12}/> :
 <span className="text-blue-700"> {`  ${dashboardOverview?.adminName}`}</span>}
</h1>

<span className="font-bold flex gap-4">

<p className="text-gray-500">{new Date().toDateString()}</p>

{isLoading ?
<SkeletonInlineText length={7}/> :
<p>{academicSession} Academic Session</p>}

{isLoading ?
<SkeletonInlineText length={7}/> :
<p>{semester}</p>}

</span>

<p className="font-bold">
Embrace the challenges , for they are opportunities in disguise.
</p>

</section>


{/* DASHBOARD CARDS */}

<section className="flex flex-col gap-7 mx-3">

<h1 className="font-bold text-4xl">Dashboard Overview</h1>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6">

<TotalStatsCard
loadingState={isLoading}
totalStudents={dashboardOverview?.totalStudents || 0}
/>

<ExpectedFeesCard
loadingState={isLoading}
amount={dashboardOverview?.totalExpected || 0}
/>

<PaidFeesCard
loadingState={isLoading}
amount={dashboardOverview?.totalPaid || 0 }
/>

<BalanceFeesCard
loadingState={isLoading}
amount={dashboardOverview?.totalBalance || 0}
studentsWithDebt={dashboardOverview?.studentsWithDebt || 0}
/>

</div>

</section>

</>

)
}