"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faFolder, faCalendar } from "@fortawesome/free-solid-svg-icons";

interface Props {
  classes: string[];
  setClasses: any;
  sections: string[];
  setSections: any;
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
    setClasses((p: string[]) => [...p, classInput.trim()]);
    setClassInput("");
  };

  const addSection = () => {
    if (!sectionInput.trim()) return;
    setSections((p: string[]) => [...p, sectionInput.trim()]);
    setSectionInput("");
  };

  const removeItem = (
    index: number,
    setter: any
  ) => setter((p: string[]) => p.filter((_: string, i: number) => i !== index));

  return (
    <div className="space-y-5">

      {/* ── Classes card ── */}
      <Card title="Classes" description="Add the class levels available in your school" icon={faSchool}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="input flex-1 w-full px-2 py-2 lg:py-2 text-sm lg:text-base"
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
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="input flex-1 w-full px-2 py-2 lg:py-2 text-sm lg:text-base"
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
          className="input w-full px-2 py-2 lg:py-2 text-sm lg:text-base"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">— Select semester —</option>
          <option value="1st Term">1st Term</option>
          <option value="2nd Term">2nd Term</option>
          <option value="3rd Term">3rd Term</option>
        </select>
      </Card>ReactNode

      <SaveBar saving={saving} onSave={onSave} />
    </div>
  );
}

// ─── Shared mini-components ──────────────────────────────────────────────────

function Card({
  title, description, icon, children,
}: {
  title: string; description: string; icon: any; children: any;
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <div className="border-b border-blue-50 px-4 lg:px-6 py-3 lg:py-4 bg-linear-to-r from-blue-700 to-blue-600">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className="text-white text-base lg:text-lg shrink-0" />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-xs lg:text-sm leading-tight">{title}</h3>
            <p className="text-blue-200 text-xs lg:text-xs line-clamp-1">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-6 space-y-4">{children}</div>
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 lg:px-4 py-2 lg:py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs lg:text-sm font-medium rounded-lg lg:rounded-xl transition-colors shadow-sm shadow-blue-200 whitespace-nowrap shrink-0"
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
    <div className="flex justify-end pt-2 lg:pt-3">
      <button
        disabled={saving}
        onClick={onSave}
        className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg lg:rounded-xl transition-colors shadow-md shadow-blue-200 text-xs lg:text-sm"
      >
        {saving ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5 lg:h-4 lg:w-4" viewBox="0 0 24 24" fill="none">
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


