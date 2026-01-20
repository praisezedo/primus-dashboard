"use client";
import Link from "next/link"
import StudentTable from "@/components/Table/StudentTable"
import Footer from "@/components/UI/Footer"
    export default function StudentsPage() {
    return <>
    <section className="p-7 flex flex-col gap-10">
    <div className="flex flex-col gap-3">
    <h1 className="font-bold text-2xl">Students Management</h1>
    <p className="text-gray-500">View ,search and manage records , fees status , and communication details</p>
    </div>

    <div className="flex justify-between items-center text-center">

<div className="flex gap-3">
 <input className="px-1 focus:outline-none focus:border-none w-80 border border-gray-200 shadow-sm rounded-lg" type="text" placeholder="Search Student Name or ID..." />

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" name="class" id="class">
        <option value="all-classes">All Classes</option>
        <option value="1st-grade">1st Grade</option>
        <option value="2nd-grade">2nd Grade</option>
        <option value="3rd-grade">3rd Grade</option>
        <option value="4th-grade">4th Grade</option>
        <option value="5th-grade">5th Grade</option>
    </select>

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" name="status" id="status">
        <option value="fees-status">Fees Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
    </select>

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" name="sms-status" id="sms-status">
        <option value="sms-status">SMS Status</option>
            <option value="sent">Sent</option>
            <option value="not-sent">Not Sent</option>
    </select>
</div>

     <Link className="hover:opacity-50  bg-blue-700 font-bold p-2 text-white rounded-lg text-center justify-center" href={"/students/add"}>Add Student</Link>
    </div>
    </section> 

    <StudentTable/>
    <Footer/>
    </>
    }