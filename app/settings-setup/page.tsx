"use client";

import { SmsTemplate } from "@/types/settings";
import { useEffect, useState } from "react"
import api from "@/lib/axios";
import PrimusLoader from "@/components/UI/PrimusLoader";
import Footer from "@/components/UI/Footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function SettingsPage() {

  const router = useRouter();
    // academic structure 
    const [classes , setClasses] = useState<string[]>([]);
    const [sections , setSections] = useState<string[]>([]);
    const [semester , setSemester] = useState<string>("");

    // inputs
    const [classInput , setClassInput] = useState<string>("");
    const [sectionInput , setSectionInput] = useState<string>("");

    //sms
    const [smsTemplate , setSmsTemplate] = useState<SmsTemplate>({paid: "" , unpaid: ""})

    const [loading , setLoading] = useState<boolean>(false);
    const [saving , setSaving] = useState<boolean>(false);

    // fetch existing settings

    useEffect(() => {
        setLoading(true);
        api.get("/api/settings/get")
        .then((res) => {
            if(!res.data) return;
            setClasses(res.data.classes || []);
            setSections(res.data.sections || []);
            setSemester(res.data.semester || "");
            setSmsTemplate(res.data.smsTemplate || {paid: "" , unpaid: ""});
        }).finally(() => {
            setLoading(false)
        }) 
    },[])

    const addClass = () => {
        if (!classInput.trim()) return;
        setClasses((prev) => [...prev , classInput.trim()]);
        setClassInput("");
    }

    const addSection = () => {
        if (!sectionInput.trim()) return;
        setSections((prev) => [...prev , sectionInput.trim()]);
        setSectionInput("");
    }

    const removeItem = (index: number , setter: React.Dispatch<React.SetStateAction<string[]>>) => {
             setter((prev) => prev.filter((_ , i) => i !== index));
    }

const saveSettings = async () => {
  if (saving) return;
  setSaving(true);

  try {
    const existing = await api.get("/api/settings/get");

    if (existing.data?.settingsCompleted) {
      // ✅ UPDATE
      await api.put("/api/settings/update", {
        classes,
        sections,
        semester,
        smsTemplate,
      });
      toast.success("Settings updated successfully");
    } else {
      // ✅ CREATE
      await api.post("/api/settings/create", {
        classes,
        sections,
        semester,
        smsTemplate,
      });
      toast.success("Settings saved successfully");
    }

    router.replace("/"); // go to dashboard
  } catch (err) {
    console.error(err);
    toast.error("Failed to save settings");
  } finally {
    setSaving(false);
  }
};


    if (loading) {
        return  <PrimusLoader/>;
    }

   return (
       <>
           <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">School Settings</h1>

      {/* Academic Structure */}
      <section className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold">Academic Structure</h2>

        {/* Classes */}
        <div>
          <label className="font-medium">Classes</label>
          <div className="flex gap-2 mt-2">
            <input
              className="focus:outline-none focus:border border rounded-lg p-2 w-full"
              placeholder="e.g. JSS 1"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
            />
            <button
              onClick={addClass}
              className="bg-blue-700 text-white px-4 rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addClass();
                }
              }}
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
              className="focus:outline-none focus:border border rounded-lg p-2 w-full"
              placeholder="e.g.  A or Science B"
              value={sectionInput}
              onChange={(e) => setSectionInput(e.target.value)}
            />
            <button
              onClick={addSection}
              className="hover:opacity bg-blue-700 text-white px-4 rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSection();
                }
              }}
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
                <button onClick={() => removeItem(i, setSections)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Semester */}
        <div>
          <label className=" font-medium">Semester or Term (Optional)</label>
          <select
            className="focus:outline-none focus:border border rounded-lg p-2 w-full mt-2"
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

      {/* SMS Settings */}
      <section className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold">SMS Templates</h2>

        <div>
          <label className="font-medium">Paid Fees Message</label>
          <textarea
            placeholder="Enter SMS Message for paid students.."
            className="focus:outline-none focus:border border rounded-lg p-3 w-full mt-2"
            rows={4}
            value={smsTemplate.paid}
            onChange={(e) =>
              setSmsTemplate({ ...smsTemplate, paid: e.target.value })
            }
          />
        </div>

        <div>
          <label className="font-medium">Unpaid Fees Message</label>
          <textarea
            placeholder="Enter SMS Message for unpaid students.."
            className="focus:outline-none focus:border border rounded-lg p-3 w-full mt-2"
            rows={4}
            value={smsTemplate.unpaid}
            onChange={(e) =>
              setSmsTemplate({ ...smsTemplate, unpaid: e.target.value })
            }
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          disabled={saving}
          onClick={saveSettings}
          className="bg-blue-700 hover:opacity-50 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>

    <Footer/>
       </>
  );
}
