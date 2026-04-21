"use client";

import { SmsTemplate } from "../types/smstemplate";
import { SaveBar } from "./AcademicStructureSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faExclamationTriangle, faTimes, faClipboard } from "@fortawesome/free-solid-svg-icons";


const SMS_PLACEHOLDER = [
 { key: "{{parentName}}", label: "Parent Name" },
 { key: "{{studentName}}", label: "Student Name" },
 { key: "{{studentId}}", label: "Student ID" },
 { key: "{{className}}", label: "Class" },
 { key: "{{section}}", label: "Section" },
 { key: "{{semester}}", label: "Semester" },
 { key: "{{feesSummary}}", label: "Fees Summary" },
];

interface Props {
  smsTemplate: SmsTemplate;
  setSmsTemplate: (v: SmsTemplate) => void;
  saving: boolean;
  onSave: () => void;
}

const TEMPLATE_FIELDS: {
  field: keyof SmsTemplate;
  label: string;
  color: string;
  icon: any;
  placeholder: string;
}[] = [
  {
    field: "paid",
    label: "Paid",
    color: "emerald",
    icon: faCheck,
   placeholder: `Dear {{parentName}}, 
   {{studentName}} ({{studentId}}) has completed payment for {{semester}}.
   {{feesSummary}}
   Thank you.`,
  },
  {
    field: "partial",
    label: "Partial Payment",
    color: "amber",
    icon: faExclamationTriangle,
    placeholder: `Dear {{parentName}},
  {{studentName}} has partially paid their fees.
  {{feesSummary}}
   Please clear the remaining balance.`,
  },
  {
    field: "unpaid",
    label: "Unpaid",
    color: "red",
    icon: faTimes,
   placeholder: `Dear {{parentName}},
   {{studentName}} has outstanding school fees.
   {{feesSummary}}
   Kindly make payment as soon as possible.`,
  },
];

const colorMap: Record<string, string> = {
  emerald: "from-emerald-600 to-emerald-500",
  amber:   "from-amber-500 to-amber-400",
  red:     "from-red-600 to-red-500",
};

const badgeMap: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  amber:   "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  red:     "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
};

export default function SmsTemplatesSection({
  smsTemplate, setSmsTemplate, saving, onSave,
}: Props) {
  const insertPlaceholder = (field: keyof SmsTemplate, key: string) => {
    setSmsTemplate({ ...smsTemplate, [field]: (smsTemplate[field] || "") + " " + key });
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Placeholder reference card */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-3 lg:p-5">
        <div className="flex items-start gap-2 lg:gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm shrink-0">
            <FontAwesomeIcon icon={faClipboard} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-semibold text-gray-800 mb-2">Available Placeholders</p>
            <div className="flex flex-wrap gap-1 lg:gap-1.5">
              {SMS_PLACEHOLDER.map((p) => (
                <span
                  key={p.key}
                  className="inline-flex items-center gap-1 px-2 lg:px-2.5 py-0.5 lg:py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg font-mono whitespace-nowrap"
                >
                  {p.key}
                  <span className="text-blue-400 font-sans non-mono hidden sm:inline">— {p.label}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Click the buttons below each template to insert placeholders automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Template cards */}
      {TEMPLATE_FIELDS.map(({ field, label, color, icon, placeholder }) => (
        <div
          key={field}
          className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden"
        >
          <div className={`px-4 lg:px-6 py-3 lg:py-4 bg-linear-to-r ${colorMap[color]}`}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={icon} className="text-white text-base lg:text-lg shrink-0" />
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-xs lg:text-sm">{label} Message Template</h3>
                <p className="text-white/70 text-xs">
                  Sent when a student's fee status is{" "}
                  <strong className="text-white">{label.toUpperCase()}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 lg:p-5 space-y-3">
            <textarea
              rows={4}
              className="w-full border border-gray-200 text-black rounded-lg lg:rounded-xl px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              placeholder={placeholder}
              value={smsTemplate[field] || ""}
              onChange={(e) => setSmsTemplate({ ...smsTemplate, [field]: e.target.value })}
            />

            {/* Insert buttons */}
            <div className="flex flex-wrap gap-1 lg:gap-1.5">
              {SMS_PLACEHOLDER.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => insertPlaceholder(field, p.key)}
                  className={`text-xs border px-2 lg:px-2.5 py-0.5 lg:py-1 rounded-lg transition-colors font-medium whitespace-nowrap ${badgeMap[color]}`}
                >
                  + {p.label}
                </button>
              ))}
            </div>

            {/* Character count */}
            <p className="text-xs text-gray-400 text-right">
              {(smsTemplate[field] || "").length} characters
              {(smsTemplate[field] || "").length > 160 && (
                <span className="text-amber-500 ml-1">
                  (will send as {Math.ceil((smsTemplate[field] || "").length / 160)} SMS)
                </span>
              )}
            </p>
          </div>
        </div>
      ))}

      <SaveBar saving={saving} onSave={onSave} label="Save SMS Templates" />
    </div>
  );
}
