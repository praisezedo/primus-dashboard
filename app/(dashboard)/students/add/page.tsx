"use client";

import Footer from "@/components/UI/Footer";
import StudentDataForm from "@/components/Forms/StudentDataForm";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import SkeletonInlineText from "@/components/UI/SkelectonInlineText";
import { DashboardOverview } from "@/components/types/dashboard";
import BulkUploadBanner from "@/components/UI/BulkUploadBanner";



export default  function AddStudentPage() {
  const [students , setStudents] = useState();
  const [loading , setLoading] = useState(true);


  const  fetchStudentsOverview = async () => {
      try {
      const res = await api.get("/api/dashboard/overview");
      setStudents(res.data as DashboardOverview);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
     fetchStudentsOverview();
  } , [])
  
  return (
    <>
      <section className="p-4 lg:p-7 flex flex-col gap-4 lg:gap-7">
        <h1 className="text-2xl lg:text-3xl font-bold text-black">Add Student</h1>
         <BulkUploadBanner/>
        <div className="shadow-sm rounded-md flex flex-col gap-3 border border-gray-200">
          <div className="border-b border-gray-200 py-3 px-3 lg:px-5 flex flex-col sm:flex-row justify-between gap-2">
           <h1 className="text-lg lg:text-xl font-bold text-black">Student & Parents Details</h1> 
            {loading ? <SkeletonInlineText length={10}/> :  <p className="font-bold text-black text-sm lg:text-base"> Total Student:  {students?.totalStudents} </p>}
          </div>
          <StudentDataForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
