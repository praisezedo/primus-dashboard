"use client";

import StudentDataForm from "@/components/Forms/StudentDataForm"
import Footer from "@/components/UI/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { JSX, useState } from "react"
import Link from "next/link";
export default function AddStudentPage() {

  const [studentForms , setStudentForms] = useState<JSX.Element[]>([<StudentDataForm/>])

  const addNewStudentForm = () => {
      setStudentForms([...studentForms , <StudentDataForm/>])
  }
    return <>
       <section className="p-7 flex flex-col gap-7">
          <h1 className="text-3xl font-bold">Add / Edit Student</h1>
     
          <div className="shadow-sm rounded-md flex flex-col gap-3 border border-gray-200">
          <div className="border-b border-gray-200 py-3 text-xl font-bold px-5 flex justify-between">
            <h1>Student & Parents Details</h1>
              <p className="text-gray-500 text-lg">Adding ({studentForms.length}) student data</p>
            </div>
            {
            studentForms.map((formelement, index) => (
              <div className="flex flex-col">
               <p className="px-7 font-bold text-gray-700 border-b border-gray-200">number {index + 1} student</p>
               <div key={index}>{formelement}</div>
                </div>
             ))
            }
          </div>

     <div className="flex items-center text-center justify-between">
         <div className="relative group">
          <span className="absolute bottom-full hidden group-hover:block bg-blue-700 mb-2  z-70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Add New Form</span>
          <button onClick={addNewStudentForm} className="hover:opacity-50 bg-blue-700 p-3 text-white rounded-md"><FontAwesomeIcon icon={faPlus}/></button>
         </div>
          <div className="items-center text-center flex gap-7">
            <Link href={'/students'} className="hover:opacity-50 border rounded-md border-gray-200 shadow-md p-3 text-black">Cancel</Link>
             <button className="hover:opacity-50 bg-blue-700 text-white p-3 rounded-md">Save Student</button>
         </div>
    </div>  

       </section>
       <Footer/>
    </>
}