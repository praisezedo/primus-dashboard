"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Student } from "@/types/student";

interface EditStudentModalProps {
  open: boolean;
  student: Student;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditStudentModal({
  open,
  student,
  onClose,
  onUpdated,
}: EditStudentModalProps) {
  const [form, setForm] = useState({
    studentName: student.studentName,
    studentId: student.studentId,
    className: student.className,
    section: student.section,
    parentName: student.parentName || "",
    parentPhone: student.parentPhone || "",
    parentEmail: student.parentEmail || "",
  });

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await api.put(`/api/students/${student._id}`, form);
    onUpdated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-125 space-y-4"
      >
        <h2 className="text-lg font-bold">Edit Student</h2>

        <input
          className="w-full border p-2 rounded"
          value={form.studentName}
          onChange={(e) =>
            setForm({ ...form, studentName: e.target.value })
          }
          placeholder="Student Name"
        />
         
         <input
          className="w-full border p-2 rounded"
          value={form.studentId}
          onChange={(e) =>
            setForm({ ...form, studentId: e.target.value })
          }
          placeholder="student custom Id"
        />

        <input
          className="w-full border p-2 rounded"
          value={form.className}
          onChange={(e) =>
            setForm({ ...form, className: e.target.value })
          }
          placeholder="Class"
        />

        <input
          className="w-full border p-2 rounded"
          value={form.section}
          onChange={(e) =>
            setForm({ ...form, section: e.target.value })
          }
          placeholder="Section"
        />
         
        <input
          className="w-full border p-2 rounded"
          value={form.parentName}
          onChange={(e) =>
            setForm({ ...form, parentName: e.target.value })
          }
          placeholder="Parent Name"
        />

        <input
          className="w-full border p-2 rounded"
          value={form.parentPhone}
          onChange={(e) =>
            setForm({ ...form, parentPhone: e.target.value })
          }
          placeholder="Parent Phone Number"
        />

        <input
          className="w-full border p-2 rounded"
          value={form.parentEmail}
          onChange={(e) =>
            setForm({ ...form, parentEmail: e.target.value })
          }
          placeholder="enter parent email"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 hover:opacity-50 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 hover:opacity-50 bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
