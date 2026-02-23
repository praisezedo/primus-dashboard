"use client";

import Footer from "@/components/UI/Footer";
import StudentDataForm from "@/components/Forms/StudentDataForm";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import SkeletonInlineText from "@/components/UI/SkelectonInlineText";
import { DashboardOverview } from "@/components/types/dashboard";



export default  function AddStudentPage() {
  const [students , setStudents] = useState<DashboardOverview>();
  const [loading , setLoading] = useState<boolean>(true);


  const  fetchStudentsOverview = async () => {
      try {
      const res = await api.get("/api/dashboard/overview");
      setStudents(res.data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
     fetchStudentsOverview();
  } , [])
  
  return (
    <>
      <section className="p-7 flex flex-col gap-7">
        <h1 className="text-3xl font-bold">Add Student</h1>

        <div className="shadow-sm rounded-md flex flex-col gap-3 border border-gray-200">
          <div className="border-b border-gray-200 py-3  px-5 flex justify-between">
           <h1 className="text-xl font-bold">Student & Parents Details</h1> 
            {loading ? <SkeletonInlineText length={10}/> :  <p className="font-bold text-black"> Total Student:  {students?.totalStudents} </p>}
          </div>
          <StudentDataForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
