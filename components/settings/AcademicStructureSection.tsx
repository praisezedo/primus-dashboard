"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faFolder, faCalendar } from "@fortawesome/free-solid-svg-icons";

interface Props {
  classes: string[];
  setClasses: React.Dispatch<React.SetStateAction<string[]>>;
  sections: string[];
  setSections: React.Dispatch<React.SetStateAction<string[]>>;
  semester: string;
  setSemester: (v: string) => void;
  saving: boolean;
  onSave: () => void;
}

export default function AcademicStructureSection({
  classes, setClasses,
  sections, setSections,
  semester, setSemester,
  saving, onSave,
}: Props) {
  const [classInput,   setClassInput]   = useState("");
  const [sectionInput, setSectionInput] = useState("");

  const addClass = () => {
    if (!classInput.trim()) return;
    setClasses((p) => [...p, classInput.trim()]);
    setClassInput("");
  };

  const addSection = () => {
    if (!sectionInput.trim()) return;
    setSections((p) => [...p, sectionInput.trim()]);
    setSectionInput("");
  };

  const removeItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => setter((p) => p.filter((_, i) => i !== index));

  return (
    <div className="space-y-5">

      {/* ── Classes card ── */}
      <Card title="Classes" description="Add the class levels available in your school" icon={faSchool}>
        <div className="flex gap-2">
          <input
            className="input flex-1  px-2"
            placeholder="e.g. JSS 1, SS 2"
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addClass()}
          />
          <AddButton onClick={addClass} />
        </div>
        <TagList
          items={classes}
          color="blue"
          onRemove={(i) => removeItem(i, setClasses)}
        />
      </Card>

      {/* ── Sections card ── */}
      <Card title="Sections" description="Define the sections or streams in your school" icon={faFolder}>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. A, Science B"
            value={sectionInput}
            onChange={(e) => setSectionInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSection()}
          />
          <AddButton onClick={addSection} />
        </div>
        <TagList
          items={sections}
          color="emerald"
          onRemove={(i) => removeItem(i, setSections)}
        />
      </Card>

      {/* ── Semester card ── */}
      <Card title="Current Semester / Term" description="Set the active academic period" icon={faCalendar}>
        <select
          className="input"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">— Select semester —</option>
          <option value="1st Term">1st Term</option>
          <option value="2nd Term">2nd Term</option>
          <option value="3rd Term">3rd Term</option>
        </select>
      </Card>

      <SaveBar saving={saving} onSave={onSave} />
    </div>
  );
}

// ─── Shared mini-components ──────────────────────────────────────────────────

function Card({
  title, description, icon, children,
}: {
  title: string; description: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <div className="border-b border-blue-50 px-6 py-4 bg-linear-to-r from-blue-700 to-blue-600">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className="text-white text-lg" />
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-blue-200 text-xs">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-blue-200 whitespace-nowrap"
    >
      + Add
    </button>
  );
}

function TagList({
  items, color, onRemove,
}: {
  items: string[];
  color: "blue" | "emerald";
  onRemove: (i: number) => void;
}) {
  if (!items.length) return (
    <p className="text-xs text-gray-400 italic">None added yet</p>
  );

  const base =
    color === "blue"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${base}`}
        >
          {item}
          <button
            onClick={() => onRemove(i)}
            className="hover:opacity-60 transition-opacity ml-0.5"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}

export function SaveBar({
  saving, onSave, label = "Save Changes",
}: {
  saving: boolean; onSave: () => void; label?: string;
}) {
  return (
    <div className="flex justify-end pt-2">
      <button
        disabled={saving}
        onClick={onSave}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-200 text-sm"
      >
        {saving ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Saving...
          </>
        ) : (
          <>✓ {label}</>
        )}
      </button>
    </div>
  );
}


