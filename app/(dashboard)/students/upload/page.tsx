"use client";
import BulkUploadForm from "@/components/Forms/BulkUploadForm";
import BulkUploadReview from "@/components/Table/BulkUploadReview";
import BulkUploadBanner from "@/components/UI/BulkUploadBanner";
import BulkUploadDirection from "@/components/UI/BulkUploadDirection";
import Footer from "@/components/UI/Footer";
import SkeletonInlineText from "@/components/UI/SkelectonInlineText";
import api from "@/lib/axios";
import { useEffect, useState } from "react";


export default function BulkUploadPage() {

    const [totalStudent , setTotalStudent] = useState(0);
    const [loading , setLoading] = useState(true);

    const fetchTotalStudents =  async() => {
        try {
          const res =  await  api.get("/api/students/bulk-upload/total-student");
          setTotalStudent(res.data.totalStudent || 0);
        }finally {
            setLoading(false);
        }
    }
     useEffect(() => {
        fetchTotalStudents();
     }, [])
    return (
         <>
         <section className="my-6 lg:my-10 mx-3 lg:mx-5">
            <div className="flex flex-col sm:flex-row justify-between gap-3 px-3 lg:px-5">
               <h1 className="font-bold text-2xl lg:text-3xl">Bulk Upload Students</h1>
            {loading ? <SkeletonInlineText length={10}/> : (<p className="font-bold text-gray-600 text-sm lg:text-base">total students: {totalStudent}</p>)}
            </div>
        <BulkUploadDirection/>
       <BulkUploadBanner/>
        <BulkUploadForm/>
        <BulkUploadReview/>
         </section>
         <Footer/>
        </>
    )
}