"use client";

import { useEffect, useState  } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../UI/LoadingSpinner";

interface SettingsResponse {
  classes: string[];
  sections: string[];
}

const initialFormState = {
    studentName: "",
    studentId: "",
    className: "",
    section: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    notify: false,
}

export default function StudentDataForm() {

const router = useRouter();

  const [classes, setClasses] = useState([] as string[]);
  const [loading, setLoading] = useState(true);
  const [saving , setSaving] = useState(false);
 const [sections , setSections] = useState([] as string[]);
  const [message , setMessage] = useState('');

  const [form, setForm] = useState(initialFormState);

  // 🔹 fetch settings (classes)
  useEffect(() => {
    async function fetchSettings() {
      const res  = await api.get("/api/settings/get");
      setClasses(res.data?.classes || []);
      setSections(res.data?.sections || []);
      setLoading(false)
    }
  
    fetchSettings();
  }, []);

  function updateField (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await api.post("/api/students", form);
       setMessage(res.data.message);
      toast.success("Student successfully saved");
      setForm(initialFormState);
      router.refresh();
    } 
catch (err: any) {
  toast.error(err?.response?.data?.message || "Failed to save student");
}finally {
      setSaving(false);
    }
  }

  if (loading) {

    return <div className="fixed inset-0 flex items-center  justify-center bg-white ">
            <div className="h-8 w-8 animate-spin rounded-full border-5 border-gray-300 border-t-blue-700" />
        </div>;
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 lg:p-5 gap-3 lg:gap-5">
        {/* Student Name */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm lg:text-base text-black">Student Name</label>
          <input
            name="studentName"
            value={form.studentName}
            onChange={updateField}
            className="focus:outline-none focus:border border text-black p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            placeholder="Enter student full name"
            required
          />
        </div>

        {/* Student ID */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm lg:text-base text-black">Student ID</label>
          <input
            name="studentId"
            value={form.studentId}
            onChange={updateField}
            className="border focus:outline-none focus:border text-black p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            placeholder="e.g., STU001"
            required
          />
        </div>

        {/* Class */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm lg:text-base text-black">Class</label>
          <select
            name="className"
            value={form.className}
            onChange={updateField}
            className="border focus:outline-none text-black focus:border p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            required
          >
            <option value="">Select Class</option>
            {classes.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-black lg:text-base">Section</label>
          <select
            name="section"
            value={form.section}
            onChange={updateField}
            className="border text-black focus:outline-none focus:border p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            required
          >
            <option value="">Select Section</option>
            {sections.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Name */}
        <div className="flex flex-col gap-2">
          <label className="font-bold  text-black text-sm lg:text-base">Parent Name</label>
          <input
            name="parentName"
            value={form.parentName}
            onChange={updateField}
            className="border text-black focus:outline-none focus:border p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            placeholder="Enter parent Name"
          />
        </div>

        {/* Parent Phone */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm lg:text-base text-black">Parent Phone</label>
          <input
            name="parentPhone"
            value={form.parentPhone}
            onChange={updateField}
            className="border text-black focus:outline-none focus:border p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            placeholder="Parent Phone  e.g., 07050243807"
          />
        </div>

        {/* Parent Email */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm lg:text-base text-black">Parent Email (Optional)</label>
          <input
            type="email"
            name="parentEmail"
            value={form.parentEmail}
            onChange={updateField}
            className="border text-black focus:outline-none focus:border p-2 lg:p-3 rounded-lg w-full text-sm lg:text-base"
            placeholder="Enter parents Email e.g fake@gmail.com"
          />
        </div>

        {/* Notify Parent */}
        <div className="flex items-center gap-3 mt-4 lg:mt-7 sm:col-span-2 lg:col-span-3">
          <input
            type="checkbox"
            name="notify"
            checked={form.notify}
            onChange={updateField}
            className="w-4 h-4"
          />
          <label className="font-bold text-black text-sm lg:text-base">Notify Parent (SMS)</label>
        </div>
      </div>

      {/* Submit handled here */}
      <div className="flex justify-end p-5">
        <button
          type="submit"
          disabled={loading || saving}
          className="bg-blue-700 hover:opacity-50 text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Student"}
        </button>
      </div>
    </form>
  );
}
