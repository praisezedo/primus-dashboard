"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import GlobalLoadingSpinner from "@/components/UI/GlobalLoadingSpinner";
import { SmsTemplate } from "../types/smstemplate";

// ─── Sub-components ─────────────────────────────────────────────────────────
import AcademicStructureSection from "./AcademicStructureSection";
import FeeTypesSection from "./FeeTypesSection";
import ClassFeeConfigSection from "./ClassFeeConfigSection";
import SmsTemplatesSection from "./SmsTemplatesSection";
import { FeeType } from "../types/feetype";
import { ClassFeeConfig } from "../types/classconfig";

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: "academic",  label: "Academic",     icon: "🏫" },
  { id: "feetypes",  label: "Fee Types",    icon: "🏷️" },
  { id: "feeconfig", label: "Fee Config",   icon: "💰" },
  { id: "sms",       label: "SMS Templates",icon: "💬" },
];

export default function SettingsEditPage() {

  const [activeTab, setActiveTab] = useState("academic");

  // ── Academic structure state ──────────────────────────────────────────────
  const [classes,  setClasses]  = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [semester, setSemester] = useState("");
  const [academicSaving, setAcademicSaving] = useState(false);

  // ── Fee types state ───────────────────────────────────────────────────────
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [feeTypeInput, setFeeTypeInput] = useState("");
  const [feeTypeSaving, setFeeTypeSaving] = useState(false);

  // ── Class fee config state ────────────────────────────────────────────────
  const [feeConfigs, setFeeConfigs] = useState<ClassFeeConfig[]>([]);
  const [configSaving, setConfigSaving] = useState(false);

  // ── SMS template state ────────────────────────────────────────────────────
  const [smsTemplate, setSmsTemplate] = useState<SmsTemplate>({
    paid: "", unpaid: "", partial: "",
  });
  const [smsSaving, setSmsSaving] = useState(false);

  const [loading, setLoading] = useState(true);

  // ── Fetch all data on mount ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchAll() {
      try {
        const [settingsRes, feeTypesRes, feeConfigsRes] = await Promise.all([
          api.get("/api/settings/get"),
          api.get("/api/fees/feetype"),
          api.get("/api/fees/class-config"),
        ]);

        if (settingsRes.data) {
          setClasses(settingsRes.data.classes || []);
          setSections(settingsRes.data.sections || []);
          setSemester(settingsRes.data.semester || "");
          setSmsTemplate(settingsRes.data.smsTemplate || { paid: "", unpaid: "", partial: "" });
        }

        setFeeTypes(feeTypesRes.data || []);
        setFeeConfigs(feeConfigsRes.data || []);
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ── Save academic structure ───────────────────────────────────────────────
  const saveAcademic = async () => {
    if (academicSaving) return;
    setAcademicSaving(true);
    try {
      await api.put("/api/settings/update", { classes, sections, semester, smsTemplate });
      toast.success("Academic structure saved");
    } catch {
      toast.error("Failed to save academic structure");
    } finally {
      setAcademicSaving(false);
    }
  };

  // ── Save SMS templates ────────────────────────────────────────────────────
  const saveSms = async () => {
    if (smsSaving) return;
    setSmsSaving(true);
    try {
      await api.put("/api/settings/update", { classes, sections, semester, smsTemplate });
      toast.success("SMS templates saved");
    } catch {
      toast.error("Failed to save SMS templates");
    } finally {
      setSmsSaving(false);
    }
  };

  // ── Add fee type ──────────────────────────────────────────────────────────
  const addFeeType = async () => {
    if (!feeTypeInput.trim() || feeTypeSaving) return;
    setFeeTypeSaving(true);
    try {
      const res = await api.post("/api/fees/feetype", { name: feeTypeInput.trim() });
      setFeeTypes((prev) => [res.data, ...prev]);
      setFeeTypeInput("");
      toast.success("Fee type added");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add fee type");
    } finally {
      setFeeTypeSaving(false);
    }
  };

  // ── Delete fee type ───────────────────────────────────────────────────────
  const deleteFeeType = async (id: string) => {
    try {
      await api.delete("/api/fees/feetype", { data: { id } });
      setFeeTypes((prev) => prev.filter((f) => f._id !== id));
      toast.success("Fee type deleted");
    } catch {
      toast.error("Failed to delete fee type");
    }
  };

  // ── Save a single class fee config ────────────────────────────────────────
  const saveClassFeeConfig = async (className: string, feeTypeId: string, amount: number) => {
    if (configSaving) return;
    setConfigSaving(true);
    try {
      const res = await api.post("/api/fees/class-config", { className, feeTypeId, amount });
      setFeeConfigs((prev) => {
        const idx = prev.findIndex(
          (c) => c.className === className && c.feeTypeId === feeTypeId
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = res.data;
          return next;
        }
        return [...prev, res.data];
      });
      toast.success(`Fee config saved for ${className}`);
    } catch {
      toast.error("Failed to save fee config");
    } finally {
      setConfigSaving(false);
    }
  };

  if (loading) return <GlobalLoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50/30 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 ml-20">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">School Settings</h1>
              <p className="text-sm text-gray-500">Manage your school's academic and fee configuration</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white border border-blue-100 rounded-2xl p-1.5 shadow-sm mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                  : "text-gray-500 hover:text-blue-700 hover:bg-blue-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Panels ── */}
        <div className="space-y-6">
          {activeTab === "academic" && (
            <AcademicStructureSection
              classes={classes}
              setClasses={setClasses}
              sections={sections}
              setSections={setSections}
              semester={semester}
              setSemester={setSemester}
              saving={academicSaving}
              onSave={saveAcademic}
            />
          )}

          {activeTab === "feetypes" && (
            <FeeTypesSection
              feeTypes={feeTypes}
              feeTypeInput={feeTypeInput}
              setFeeTypeInput={setFeeTypeInput}
              saving={feeTypeSaving}
              onAdd={addFeeType}
              onDelete={deleteFeeType}
            />
          )}

          {activeTab === "feeconfig" && (
            <ClassFeeConfigSection
              classes={classes}
              feeTypes={feeTypes}
              feeConfigs={feeConfigs}
              saving={configSaving}
              onSave={saveClassFeeConfig}
            />
          )}

          {activeTab === "sms" && (
            <SmsTemplatesSection
              smsTemplate={smsTemplate}
              setSmsTemplate={setSmsTemplate}
              saving={smsSaving}
              onSave={saveSms}
            />
          )}
        </div>
      </div>
    </div>
  );
}
