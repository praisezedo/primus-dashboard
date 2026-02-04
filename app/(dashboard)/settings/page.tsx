"use client";

import PrimusLoader from "@/components/UI/PrimusLoader";
import api from "@/lib/axios";
import { SmsTemplate } from "@/types/settings";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsEditPage() {
    const [classes , setClasses] = useState<string[]>([]);
    const [sections , setSections] = useState<string[]>([]);
    const [semester , setSemester] = useState("");

    const [smsTemplate , setSmsTemplate] = useState<SmsTemplate>({paid: "" , unpaid: ""});
    const [classInput , setClassInput] = useState<string>("");
    const [sectionInput , setSectionInput] = useState("");

    const [loading , setLoading] = useState(true);
    const [saving , setSaving ] = useState(false);
     const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
             try {
                const res = await api.get("/api/settings/get");
                if (res.data) {
                    setClasses(res.data.classes || []);
                    setSections(res.data.sections || []);
                    setSemester(res.data.semester || "");
                    setSmsTemplate(res.data.smsTemplate || {paid: "", unpaid: ""});
                }
             }  finally {
                setLoading(false);
             }
        }

 fetchSettings();
    }, []);

     const addClass = () => {
    if (!classInput.trim()) return;
    setClasses((prev) => [...prev, classInput.trim()]);
    setClassInput("");
  };

  const addSection = () => {
    if (!sectionInput.trim()) return;
    setSections((prev) => [...prev, sectionInput.trim()]);
    setSectionInput("");
  }

  const removeItem = (index: number , setter: React.Dispatch<React.SetStateAction<string[]>>) => {
     setter((prev) => prev.filter((_ , i) => i !== index));
  }

  const saveChanges = async () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);

    try {
      await api.put("/api/settings/update", {
        classes,
        sections,
        semester,
        smsTemplate,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success(" ✔ Changes saved");
    } catch (err) {
      toast.error("Failed to change")
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PrimusLoader/>;

    return (
    <div className="p-6 max-w-4xl ml-20 mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Academic Structure */}
      <section className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold">Academic Structure</h2>

        {/* Classes */}
        <div>
          <label className="font-medium">Classes</label>
          <div className="flex gap-2 mt-2">
            <input
              className="border rounded-lg p-2 w-full"
              placeholder="e.g. JSS 1"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addClass()}
            />
            <button
              onClick={addClass}
              className="bg-blue-700  hover:opacity-50 text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {classes.map((c, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {c}
                <button onClick={() => removeItem(i, setClasses)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div>
          <label className="font-medium">Sections</label>
          <div className="flex gap-2 mt-2">
            <input
              className="border rounded-lg p-2 w-full"
              placeholder="e.g. A or Science B"
              value={sectionInput}
              onChange={(e) => setSectionInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSection()}
            />
            <button
              onClick={addSection}
              className="bg-blue-700 hover:opacity-50 text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {sections.map((s, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {s}
                <button  onClick={() => removeItem(i, setSections)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Semester */}
        <div>
          <label className="font-medium">Semester or Term  (Optional)</label>
          <select
            className="border rounded-lg p-2 w-full mt-2"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select semester</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
          </select>
        </div>
      </section>

      {/* SMS */}
      <section className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold">SMS Templates</h2>
        <div className="flex flex-col gap-3">

        <label className="font-bold" htmlFor="paid">Paid Message</label>
        <textarea
          className="border rounded-lg p-3 w-full"
          rows={4}
          placeholder="Paid fees message"
          value={smsTemplate.paid}
          onChange={(e) =>
            setSmsTemplate({ ...smsTemplate, paid: e.target.value })
          }
        />
        </div>
         < div className="flex flex-col gap-3">
          <label  className="font-bold"  htmlFor="unpaid">Unpaid Message</label>
          <textarea
          className="border rounded-lg p-3 w-full"
          rows={4}
          placeholder="Unpaid fees message"
          value={smsTemplate.unpaid}
          onChange={(e) =>
            setSmsTemplate({ ...smsTemplate, unpaid: e.target.value })
          }
        />
         </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end gap-4">
        <button
          disabled={saving}
          onClick={saveChanges}
          className="hover:opacity-50 bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
