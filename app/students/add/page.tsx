"use client";

import StudentDataForm from "@/components/Forms/StudentDataForm"
import Footer from "@/components/UI/Footer"
import Link from "next/link";

export default function AddStudentPage() {

    return <>

       <section className="p-7 flex flex-col gap-7">
          <h1 className="text-3xl font-bold">Add / Edit Student</h1>
     
          <div className="shadow-sm rounded-md flex flex-col gap-3 border border-gray-200">
          <div className="border-b border-gray-200 py-3 text-xl font-bold px-5 flex justify-between">
            <h1>Student & Parents Details</h1>
            </div>
            <div>
              <StudentDataForm/>
            </div>
          </div>

     <div className="flex items-center text-center justify-end">
          <div className="items-center text-center flex gap-7">
            <Link href={'/students'} className="hover:opacity-50 border rounded-md border-gray-200 shadow-md p-3 text-black">Cancel</Link>
             <button className="hover:opacity-50 bg-blue-700 text-white p-3 rounded-md">Save Student</button>
         </div>
    </div>  

       </section>
       <Footer/>
    </>
}