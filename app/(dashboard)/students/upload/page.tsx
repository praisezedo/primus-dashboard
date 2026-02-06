"use client";
import BulkUploadForm from "@/components/Forms/BulkUploadForm";
import BulkUploadReview from "@/components/Table/BulkUploadReview";
import BulkUploadDirection from "@/components/UI/BulkUploadDirection";
import Footer from "@/components/UI/Footer";
import SkeletonInlineText from "@/components/UI/SkelectonInlineText";
import api from "@/lib/axios";
import { useEffect, useState } from "react";


export default function BulkUploadPage() {

    const [totalStudent , setTotalStudent] = useState<number>(0);
    const [loading , setLoading] = useState<boolean>(true);

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
         <section className="my-10 mx-5">
            <div className="flex justify-between px-5">
               <h1 className="font-bold text-3xl">Bulk Upload Students Page.</h1>
            {loading ? <SkeletonInlineText length={10}/> : (<p className="font-bold text-gray-600">total student: {totalStudent}</p>)}
            </div>
        <BulkUploadDirection/>
        <BulkUploadForm/>
        <BulkUploadReview/>
         </section>
         <Footer/>
        </>
    )
}