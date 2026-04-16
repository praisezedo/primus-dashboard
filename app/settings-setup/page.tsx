"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import PrimusLogo from '@/components/UI/PrimusLogo';
import { useEffect } from 'react';

export default function SetupPage() {
    const router = useRouter();
const [classes, setClasses] = useState([] as string[]);
  const [sections, setSections] = useState([] as string[]);
  const [semester, setSemester] = useState("");

    const [classInput, setClassInput] = useState("");
  const [sectionInput, setSectionInput] = useState("");

    const [loading, setLoading] = useState(false);

    const addClass = () => {
      if (!classInput.trim()) return;
         setClasses((prev: string[]) => [...prev, classInput.trim()]);
         setClassInput("");
    }
 
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/settings/get");
        if (res?.data) {
           setClasses(res.data.classes || []);
            setSections(res.data.sections || []);
            setSemester(res.data.semester || "");
        }
      } catch (error: any) {
        console.error("Error fetching settings:", error);
      }
    }

    useEffect(() => {
       fetchSettings();
    }, []);

  const addSection = () => {
    if (!sectionInput.trim()) return;
    setSections((prev: string[]) => [...prev, sectionInput.trim()]);
    setSectionInput("");
  };

  const deleteItem = (index: number, type: "class" | "section"): void => {
     if (type === "class") {
        setClasses((prev: string[]) => prev.filter((_, i:number) => i !== index));
     } 
     else if (type === "section") {
        setSections((prev: string[]) => prev.filter((_, i:number) => i !== index));
     } else {
        return;
     }
  }

  const handleSave = async () => {
    if (!classes.length) {
      toast.error("Please add at least one class");
      return;
    }

 if (!semester) {
      toast.error("Please select a semester");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/settings/create", {
        classes,
        sections,
        semester,
        smsTemplate: {
          paid: "",
          partial: "",
          unpaid: "",
        },
      });
      toast.success("Setup completed successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-6 md:p-10 space-y-6 md:space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <PrimusLogo />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 my-4 ">
            Welcome to Primus
          </h1>
          <p className="text-gray-500 ">
            Let’s set up your school structure. This only takes 2 minutes.
          </p>
        </div>
         {/* INFO BANNER */}
<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start text-sm text-blue-700">
  <span className="text-lg">ℹ️</span>
  <div>
    <p className="font-semibold text-black">Don’t worry</p>
    <p className="text-black">
      You can edit classes, sections, semester and configure fees later
      from the Settings page in your dashboard.
    </p>
  </div>
</div>
        {/* STEP 1 - CLASSES */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 ">
            Step 1: Add Your Classes
          </h2>
          <p className="text-sm text-gray-500 ">
            Example: JSS1, JSS2, SS1, Grade 1, Grade 2
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addClass();
                }
              }}
              placeholder="Enter class name"
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none text-black"
            />
            <button
              onClick={addClass}
              className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition whitespace-nowrap"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {classes.map((c: string, i: number) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {c}
                <button
                  onClick={() => deleteItem(i, "class")}
                  className="ml-1 text-blue-600 hover:text-blue-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* STEP 2 - SECTIONS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold  text-black">
            Step 2: Add Sections (Optional)
          </h2>
          <p className="text-sm text-gray-500 ">
            Example: A, B, C (Leave empty if not applicable)
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={sectionInput}
              onChange={(e) => setSectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSection();
                }
              }}
              placeholder="Enter section"
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none text-black"
            />
            <button
              onClick={addSection}
              className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition whitespace-nowrap"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sections.map((s: string, i:number) => (
              <span
                key={i}
                className="bg-blue-50 border text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {s}
                <button
                  onClick={() => deleteItem(i, "section")}
                  className="ml-1 text-blue-600 hover:text-blue-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* STEP 3 - SEMESTER */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black">
            Step 3: Current Semester / Term
          </h2>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none text-black"
          >
            <option value="">Select Term</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-6 border-t">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </div>

      </div>
    </div>
  );
}
