

import api from '@/lib/axios';
import { Settings } from '@/types/settings';
import {useEffect, useRef , useState} from 'react';
import PrimusLoader from '../UI/PrimusLoader';
import Input from './Input';
import Select from './Select';
import { StudentInput } from '@/types/student';
import LoadingSpinner from '../UI/LoadingSpinner';

export default function StudentDataForm() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading , setLoading] = useState<boolean>(true);
    const [notify , setNotify] = useState<boolean>(true);
    const [settings , setSettings] = useState<Settings | null>(null);

    const [form , setForm] = useState<StudentInput>({
        studentName: "",
        studentId: "",
        className: "",
        section: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        feesStatus: "",
    });

    useEffect(() => {
        api.get("/api/settings/get")
        .then(res =>  setSettings(res.data))
        .finally(() => setLoading(false));
    }, [])

    const updateField = (key: string , value: string) => {
        setForm(prev => ({...prev , [key]: value}));
    }
    useEffect(() => {
         inputRef.current?.focus();
    },[])

    if (loading) return <LoadingSpinner/>;

    if (!settings) {
        return <p className='text-red-600'>Settings not found</p>;
    }

    const smsAvailable = !!settings.smsTemplate?.paid || !!settings.smsTemplate?.unpaid;

  return (
    <form className="grid grid-cols-3 gap-6 p-5">
      
      {/* Student Name */}
      <Input
        label="Student Name"
        value={form.studentName}
        onChange={(v: string) => updateField("studentName", v)}
        placeholder="Enter student's full name"
      />

      {/* Student ID */}
      <Input
        label="Student ID"
        value={form.studentId}
        onChange={(v: string) => updateField("studentId", v)}
        placeholder="e.g. STU012"
      />

      {/* Class */}
      <Select
        label="Class"
        value={form.className}
        onChange={(v: string) => updateField("class", v)}
        options={settings.classes}
        placeholder="Select class"
      />

      {/* Section */}
      <Select
        label="Section"
        value={form.section}
        onChange={(v: string) => updateField("section", v)}
        options={settings.sections}
        placeholder="Select section"
      />

      {/* Parent Name */}
      <Input
        label="Parent Name"
        value={form.parentName}
        placeholder="Enter parents name .."
        onChange={(v: string) => updateField("parentName", v)}
      />

      {/* Parent Phone */}
      <Input
        label="Parent Phone"
        value={form.parentPhone}
        onChange={(v: string) => updateField("parentPhone", v)}
        placeholder="e.g ., 07050243807"
      />

      {/* Parent Email */}
      <Input
        label="Parent Email (Optional)"
        value={form.parentEmail}
        placeholder="Enter parent Email (Optional)"
        onChange={(v: string) => updateField("parentEmail", v)}
      />

      {/* Fees Status */}
      <Select
        label="Fees Status"
        value={form.feesStatus}
        onChange={(v: string) => updateField("feesStatus", v)}
        options={["PAID", "UNPAID"]}
        placeholder="Select status"
      />

      {/* Notify */}
      <div className="flex items-center gap-3 mt-8">
        <input
          type="checkbox"
          checked={notify}
          disabled={!smsAvailable || !form.parentPhone}
          onChange={() => setNotify(!notify)}
        />
        <label className="font-bold">
          Notify Parent via SMS
          {!smsAvailable && (
            <span className="text-sm text-gray-400 ml-2">
              (No SMS template)
            </span>
          )}
        </label>
      </div>
    </form>
  )
}