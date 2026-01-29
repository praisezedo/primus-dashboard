"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GlobalLoadingSpinner from "../UI/GlobalLoadingSpinner";

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
    feesStatus: "UNPAID",
    notify: true,
  
}
export default function StudentDataForm() {


  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving , setSaving] = useState<boolean>(false);
 const [sections , setSections] = useState<string[]>([]);

  const [form, setForm] = useState(initialFormState);

  // 🔹 fetch settings (classes)
  useEffect(() => {
    async function fetchSettings() {
      const res = await api.get<SettingsResponse>("/api/settings/get");
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

    setForm((prev) => ({
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
    await api.post("/api/students", form);
      toast.success("Stuent successfully saved");
       setForm(initialFormState);
    } catch (err) {
       toast.error("Failed to create student");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <GlobalLoadingSpinner/>
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 p-5 gap-5">
        {/* Student Name */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Student Name</label>
          <input
            name="studentName"
            value={form.studentName}
            onChange={updateField}
            className="focus:outline-none focus:border border p-3 rounded-lg w-80"
            placeholder="Enter student full name"
            required
          />
        </div>

        {/* Student ID */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Student ID</label>
          <input
            name="studentId"
            value={form.studentId}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
            placeholder="e.g., STU001"
            required
          />
        </div>

        {/* Class */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Class</label>
          <select
            name="className"
            value={form.className}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
            required
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Section</label>
          <select
            name="section"
            value={form.section}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
            required
          >
            <option value="">Select Section</option>
            {sections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Name */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Parent Name</label>
          <input
            name="parentName"
            value={form.parentName}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
            placeholder="Enter parent Name"
          />
        </div>

        {/* Parent Phone */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Parent Phone</label>
          <input
            name="parentPhone"
            value={form.parentPhone}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
            placeholder="Parent Phone Number  e.g., 07050243807"
          />
        </div>

        {/* Parent Email */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Parent Email (Optional)</label>
          <input
            type="email"
            name="parentEmail"
            value={form.parentEmail}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
            placeholder="Enter parents Email e.g fake@gmail.com"
          />
        </div>

        {/* Fees Status */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Fees Status</label>
          <select
            name="feesStatus"
            value={form.feesStatus}
            onChange={updateField}
            className="border focus:outline-none focus:border p-3 rounded-lg w-80"
          >
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
          </select>
        </div>

        {/* Notify Parent */}
        <div className="flex items-center gap-3 mt-7">
          <input
            type="checkbox"
            name="notify"
            checked={form.notify}
            onChange={updateField}
          />
          <label className="font-bold">Notify Parent (SMS)</label>
        </div>
      </div>

      {/* Submit handled here */}
      <div className="flex justify-end p-5">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:opacity-50 text-white px-6 py-2 rounded-md"
        >
          {saving ? "Saving..." : "Save Student"}
        </button>
      </div>
    </form>
  );
}
