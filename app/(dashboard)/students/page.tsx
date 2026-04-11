"use client";
import Link from "next/link"
import StudentTable from "@/components/Table/StudentTable"
import Footer from "@/components/UI/Footer";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ConfirmModal from "@/components/UI/ConfirmModal";
import { useDebounce } from "@/utils/useDebounce";
import { toast } from "sonner";
import PrimusLoader from "@/components/UI/PrimusLoader";

export default function StudentsPage() {

     const [students , setStudents] = useState<any[]>([]);
     const [classes , setClasses] = useState<string[]>([]);
     const [search , setSearch] = useState<string>("");
     const [className , setClassName] = useState<string>("");
     const [smsStatus, setSmsStatus] = useState<string>("");
     const [loading , setLoading] = useState<boolean>(true);
     const [sections , setSections] = useState<string[]>([]);
     const [section , setSection] = useState<string>("");
     const [deleting , setDeleting] = useState<boolean>(false);
     const [smsMenuOpen, setSmsMenuOpen] = useState<boolean>(false);
     const [groupConfirmOpen, setGroupConfirmOpen] = useState<boolean>(false);
     const [selectedGroup, setSelectedGroup] = useState<"PAID" | "UNPAID" | "PARTIAL" | "">("");
     const [groupSending, setGroupSending] = useState<boolean>(false);

// fetching settings
async function fetchSettings() {
    const res = await api.get("/api/settings/get");
    setClasses(res.data.classes || []);
    setSections(res.data.sections || []);
}

 const debouncSearch = useDebounce(search , 1100);

// fetch students
async function fetchStudents() {
    setLoading(true);
    const params: any = {};
    if (debouncSearch) params.q = debouncSearch;
    if (className) params.className = className;
    if (section) params.section = section;
    if (smsStatus) params.smsStatus = smsStatus;
        const res = await api.get("/api/students", { params });
        const data = res.data;
        if (data.students) {
            setStudents(data.students);
        } else {
            setStudents(data);
        }
    setLoading(false);
}


// delete student 
async function deleteStudent(id: string) {
    const studentToDelete = students.find(s => s._id === id);
    if (!studentToDelete) return;

    // Optimistic update: remove from list immediately
    setStudents(prev => prev.filter(s => s._id !== id));
 
    try {
        setDeleting(true)
     const res = await api.delete(`/api/students/${id}`);
    toast.success(res.data.message);
    
    } catch (error: any) {
        // Revert optimistic update on error
        setStudents(prev => [...prev, studentToDelete]);
        toast.error(error.response?.data?.message || "Could not delete student");
    } finally {
        setDeleting(false);
    }
}


function handleSelectGroup(status: "PAID" | "UNPAID" | "PARTIAL", e: React.MouseEvent) {
    e.stopPropagation();

    setSelectedGroup(status);
    setSmsMenuOpen(false);
    setGroupConfirmOpen(true);
}

async function handleConfirmGroupSend() {
    if (!selectedGroup) return;

    try {
      setGroupSending(true);
      const response = await api.post("/api/sms/students", {
        status: selectedGroup,
      });
      const sent = response.data.sent || 0;
      const failed = response.data.failed || 0;

      toast.success(`SMS sent to ${sent} ${selectedGroup.toLowerCase()} student(s)`);
      if (failed > 0) {
        toast.error(`${failed} message(s) failed to send`);
      }

      fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send group SMS");
    } finally {
      setGroupSending(false);
      setGroupConfirmOpen(false);
      setSelectedGroup("");
    }
}

useEffect(() => {
    fetchSettings();
} , [])

useEffect(() => {
    fetchStudents();
} , []);

useEffect(() => {
    fetchStudents();
}, [debouncSearch , className , smsStatus , section]);

if (loading) {
    return <PrimusLoader/>;
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
    name="className" id="className"
    value={className}
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
      name="section" id="section"
      value={section}
      onChange={(e) => setSection(e.target.value)}
      >
        <option value="">All Sections</option>
        {
            sections.map((s) => (
                <option key={s} value={s}>{s}</option>
            ))
        }
      </select>

    <select className="border border-gray-200 shadow-sm rounded-lg p-3" 
    name="smsStatus" id="smsStatus"
    value={smsStatus}
    onChange={(e) => setSmsStatus(e.target.value)}
    >
        <option value="">SMS Status</option>
            <option value="SENT">SENT</option>
            <option value="FAILED">FAILED</option>
            <option value="PENDING">PENDING</option>
    </select>
</div>

     <div className="relative flex items-center gap-3">
       <button
         type="button"
         onClick={() => setSmsMenuOpen((prev) => !prev)}
         className="bg-green-700 hover:opacity-80 text-white rounded-lg px-4 py-2 font-semibold"
       >
         Send SMS
       </button>
       {smsMenuOpen && (
         <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border bg-white shadow-lg">
           <button
             type="button"
             onClick={(e) => handleSelectGroup("PAID", e)}
             className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50"
           >
             Send SMS to paid students
           </button>
           <button
             type="button"
             onClick={(e) => handleSelectGroup("UNPAID", e)}
             className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50"
           >
             Send SMS to unpaid students
           </button>
           <button
             type="button"
             onClick={(e) => handleSelectGroup("PARTIAL", e)}
             className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50"
           >
             Send SMS to partial paid students
           </button>
         </div>
       )}

     <Link className="hover:opacity-50 bg-blue-700 font-bold p-2 text-white rounded-lg text-center justify-center" href={"/students/add"}>Add Student</Link>
     </div>
    </div>
    </section> 

         <StudentTable  students={students}  onRefresh={fetchStudents} onDelete={deleteStudent} deleting={deleting} />

    <ConfirmModal
      open={groupConfirmOpen}
      title={`Send SMS to ${selectedGroup.toLowerCase()} students`}
      message={`Send fee notification SMS to all ${selectedGroup.toLowerCase()} students now?`}
      confirmLabel="Send SMS"
      cancelLabel="Cancel"
      onClose={() => setGroupConfirmOpen(false)}
      onConfirm={handleConfirmGroupSend}
      loading={groupSending}
    />

    <Footer/>
    </>
    }