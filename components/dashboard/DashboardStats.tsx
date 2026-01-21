

import PaidStatsCard from "./PaidStatsCard";
import TotalStatsCard from "./TotalStatsCard";
import UnpaidStatsCard from "./UnpaidStatsCard";
import { DashboardOverview } from "@/types/dashboard";
import axios from 'axios';
import { useState , useEffect} from "react";
import SkeletonInlineText from "../UI/SkelectonInlineText";

export default function DashboardStats  () {

const [dashboardOverview , setDashboardOverview] = useState<DashboardOverview>({totalStudents: 0 , paid: 0 , unpaid: 0 , adminName: ""})
const [isLoading , setIsLoading] = useState(true);
useEffect(() => {

    axios.get('/api/dashboard/overview')
        .then(res => {
            setDashboardOverview(res.data)
            setIsLoading(false)
    })
},[])


    return <>
    <section className="relative bg-white px-6 py-10 mb-5 border-b border-gray-200 shadow-sm flex flex-col gap-3">
    <h1 className="font-bold text-3xl">Welcome , Admin {isLoading ?<SkeletonInlineText length={12}/> : dashboardOverview.adminName.split(" ")[0]}</h1>
    <p className="text-gray-500">{new Date().toDateString()}</p>
    <p className="font-bold">Embrace the challenges , for they are opportunities in disguise.</p>
     </section> 


      <section className="flex flex-col gap-7 mx-3">
        <h1 className="font-bold text-4xl">DashBoard Overview</h1>
        <div className="grid grid-cols-3">
            <TotalStatsCard loadingState={isLoading}  totalStudents={dashboardOverview.totalStudents} />
            <PaidStatsCard loadingState={isLoading} paidStudents={dashboardOverview.paid}/>
            <UnpaidStatsCard loadingState={isLoading} unpaidStudents={dashboardOverview.unpaid}/>
        </div>
        
      </section>
    </>
}