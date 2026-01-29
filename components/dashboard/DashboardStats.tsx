"use client";

import PaidStatsCard from "./PaidStatsCard";
import TotalStatsCard from "./TotalStatsCard";
import UnpaidStatsCard from "./UnpaidStatsCard";
import { DashboardOverview } from "@/types/dashboard";
import { useState , useEffect} from "react";
import SkeletonInlineText from "../UI/SkelectonInlineText";
import api from "@/lib/axios";
import SentSMS from "./SentSMS";
import NotSentSMS from "./NotSentSMS";
import BulkUploadReview from "./BulkUploadReview";

export default function DashboardStats  () {

const [dashboardOverview , setDashboardOverview] = useState<DashboardOverview>({totalStudents: 0 , paid: 0 , unpaid: 0 , adminName: ""})
const [academicSession , setAcademicSession] = useState<string>("");
const [semester , setSemester] = useState<string>("");
const [isLoading , setIsLoading] = useState(true);
useEffect(() => {
    const fetchData = async () => {
        try {
            const [dashBoard , academicSession , settings] = await Promise.all([api.get("/api/dashboard/overview"), api.get("/api/session/current") , api.get("/api/settings/get")]);
            setDashboardOverview(dashBoard.data);
            setAcademicSession(academicSession.data.name);
            setSemester(settings.data.semester);
            setIsLoading(false);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    fetchData();
},[])


    return <>
    <section className="relative bg-white px-6 py-10 mb-5 border-b border-gray-200 shadow-sm flex flex-col gap-7">
    <h1 className="font-bold text-3xl text-black">Welcome , Admin  {isLoading ?<SkeletonInlineText length={12}/> : <span className="text-blue-700">{dashboardOverview.adminName}</span>}</h1>
    <span className="font-bold flex gap-4">
        <p className="text-gray-500">{new Date().toDateString()}</p>
        {isLoading ? <SkeletonInlineText length={7}/> : <p>{academicSession} Academic Session</p>}
        {isLoading ? <SkeletonInlineText length={7}/> : <p>{semester}</p>}
        </span>
    <p className="font-bold">Embrace the challenges , for they are opportunities in disguise.</p>
     </section> 


      <section className="flex flex-col gap-7 mx-3">
        <h1 className="font-bold text-4xl">DashBoard Overview</h1>
        <div className="grid grid-cols-3">
            <TotalStatsCard loadingState={isLoading}  totalStudents={dashboardOverview.totalStudents} />
            <PaidStatsCard loadingState={isLoading} paidStudents={dashboardOverview.paid}/>
            <UnpaidStatsCard loadingState={isLoading} unpaidStudents={dashboardOverview.unpaid}/>
            <SentSMS/>
            <NotSentSMS/>
            <BulkUploadReview/>
        </div>
        
      </section>
    </>
}