"use client";
import Link from "next/link"
import StudentTable from "@/components/Table/StudentTable"
import Footer from "@/components/UI/Footer"
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import GlobalLoadingSpinner from "@/components/UI/GlobalLoadingSpinner";
import { useDebounce } from "@/utils/useDebounce";
import { toast } from "sonner";

export default function StudentsPage() {

     const [students , setStudents] = useState<any[]>([]);
     const [classes , setClasses] = useState<string[]>([]);
     const [search , setSearch] = useState<string>("");
     const [className , setClassName] = useState<string>("");
     const [feesStatus, setFeesStatus] = useState<string>("");
     const [smsStatus, setSmsStatus] = useState<string>("");
     const [loading , setLoading] = useState<boolean>(true);

// fetching settings
async function fetchSettings() {
    const res = await api.get("/api/settings/get");
    setClasses(res.data.classes || []);
}

 const debouncSearch = useDebounce(search , 500);
// fetch students
async function fetchStudents() {
    const params: any = {};
    if (debouncSearch) params.q = debouncSearch;
    if (className) params.className = className;
    if (feesStatus) params.feesStatus = feesStatus;
    if (smsStatus) params.smsStatus = smsStatus;

    const res = await api.get("/api/students" , {params});
    setStudents(res.data);
    setLoading(false);
}

// delete student 
async function deleteStudent(id: string) {
    try {
    const res = await api.delete(`/api/students/${id}`);
    toast.success(res.data.message);
    fetchStudents();
    } catch {
        toast.error("Could not delete student");
    }
}

useEffect(() => {
    fetchSettings();
}, [])

useEffect(() => {
    fetchStudents();
}, [debouncSearch , className , feesStatus , smsStatus]);

if (loading) {
    return <GlobalLoadingSpinner/>
} 
    return <>
    <section className="p-7 flex flex-col gap-10">
    <div className="flex flex-col gap-3">
    <h1 className="font-bold text-2xl">Students Management</h1>
    <p className="text-gray-500">View ,search and manage records , fees status , and communication details</p>
    </div>

    <div className="flex justify-between items-center text-center">

<div className="flex gap-3">
 <input className="px-1 focus:outline-none focus:border-none w-80 border border-gray-200 shadow-sm rounded-lg" 
  type="text" placeholder="Search Student Name or ID..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  />

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" 
    name="class" id="class"
    onChange={(e) => setClassName(e.target.value)}
    >
        <option value="">All Classes</option>
       {
        classes.map((c) => (
            <option key={c} value={c}>{c}</option>
        ))
       }
    </select>

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" 
    name="fees-status" id="fees-status"
    onChange={(e) => setFeesStatus(e.target.value)}
    >
        <option value="">Fees Status</option>
            <option value="PAID">PAID</option>
            <option value="UNPAID">UNPAID</option>
    </select>

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" 
    name="sms-status" id="sms-status"
    onChange={(e) => setSmsStatus(e.target.value)}
    >
        <option value="">SMS Status</option>
            <option value="SENT">SENT</option>
            <option value="NOTSENT">NOT SENT</option>
            <option value="PENDING">PENDING</option>
    </select>
</div>

     <Link className="hover:opacity-50  bg-blue-700 font-bold p-2 text-white rounded-lg text-center justify-center" href={"/students/add"}>Add Student</Link>
    </div>
    </section> 

    <StudentTable  students={students} onRefresh={fetchStudents} onDelete={deleteStudent}/>
    <Footer/>
    </>
    }