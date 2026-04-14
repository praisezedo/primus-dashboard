"use client";

import { useState, useEffect } from "react";
import { FeeType } from "../types/feetype";
import { ClassFeeConfig } from "../types/classconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faClipboard, faLightbulb, faSchool } from "@fortawesome/free-solid-svg-icons";

interface Props {
  classes: string[];
  feeTypes: FeeType[];
  feeConfigs: ClassFeeConfig[];
  saving: boolean;
  onSave: (className: string, feeTypeId: string, amount: number) => Promise<void>;
}

// Local editable grid: className+feeTypeId → amount string
type GridState = Record<string, string>;

function configKey(className: string, feeTypeId: string) {
  return `${className}::${feeTypeId}`;
}

export default function ClassFeeConfigSection({
  classes, feeTypes, feeConfigs, saving, onSave,
}: Props) {
  const [grid, setGrid] = useState({} as GridState);
  const [savingCell, setSavingCell] = useState(null  as string | null);
  const [savedCells, setSavedCells] = useState(new Set() as Set<string>);

  // Populate grid from fetched configs
  useEffect(() => {
    const init: GridState = {};
    feeConfigs.forEach((c) => {
      init[configKey(c.className, c.feeTypeId)] = String(c.amount);
    });
    setGrid(init);
  }, [feeConfigs]);

  const handleChange = (className: string, feeTypeId: string, value: string) => {
    setGrid((prev: GridState) => ({ ...prev, [configKey(className, feeTypeId)]: value }));
  };

  const handleSaveCell = async (className: string, feeTypeId: string) => {
    const key = configKey(className, feeTypeId);
    const raw = grid[key] || "";
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount < 0) return;

    setSavingCell(key);
    await onSave(className, feeTypeId, amount);
    setSavingCell(null);
    setSavedCells((prev: Set<string>) => new Set(prev).add(key));
    setTimeout(() => {
      setSavedCells((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 2000);
  };

  if (classes.length === 0 || feeTypes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="border-b border-blue-50 px-4 lg:px-6 py-3 lg:py-4 bg-linear-to-r from-blue-700 to-blue-600">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCog} className="text-white text-base lg:text-lg shrink-0" />
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-xs lg:text-sm">Class Fee Configuration</h3>
              <p className="text-blue-200 text-xs">Set fee amounts per class per fee type</p>
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-10 text-center text-gray-400">
          <div className="text-3xl lg:text-4xl mb-2 lg:mb-3"><FontAwesomeIcon icon={faClipboard} className="text-gray-400" /></div>
          <p className="text-xs lg:text-sm font-medium">Setup required</p>
          <p className="text-xs mt-1">
            {classes.length === 0
              ? "Add classes in the Academic tab first."
              : "Add fee types in the Fee Types tab first."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-blue-50 px-4 lg:px-6 py-3 lg:py-4 bg-linear-to-r from-blue-700 to-blue-600">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCog} className="text-white text-base lg:text-lg shrink-0" />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-xs lg:text-sm">Class Fee Configuration</h3>
            <p className="text-blue-200 text-xs">
              Set the amount each class pays per fee type. Each cell saves independently.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg lg:rounded-xl p-2 lg:p-3 mb-4 lg:mb-5 text-xs text-blue-700 flex gap-2 items-start">
          <FontAwesomeIcon icon={faLightbulb} className="text-base text-blue-700 mt-0.5 lg:mt-1 shrink-0" />
          <p className="text-xs lg:text-sm">
            Enter the amount for each class and fee type combination, then click{" "}
            <strong>Save</strong> on that cell. Different classes can have different amounts for
            the same fee type.
          </p>
        </div>

        {/* Grid table */}
        <div className="overflow-x-auto rounded-lg lg:rounded-xl border border-gray-100">
          <table className="w-full text-xs lg:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24 lg:w-32">
                  Class
                </th>
                {feeTypes.map((ft) => (
                  <th
                    key={ft._id}
                    className="text-left px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {ft.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {classes.map((cls) => (
                <tr key={cls} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-2 lg:px-4 py-2 lg:py-3">
                    <span className="inline-flex items-center gap-1 px-2 lg:px-2.5 py-0.5 lg:py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold whitespace-nowrap">
                      <FontAwesomeIcon icon={faSchool} className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> {cls}
                    </span>
                  </td>
                  {feeTypes.map((ft) => {
                    const key = configKey(cls, ft._id);
                    const isSavingThis = savingCell === key;
                    const isSaved = savedCells.has(key);
                    return (
                      <td key={ft._id} className="px-2 lg:px-4 py-2 lg:py-3">
                        <div className="flex items-center gap-1">
                          <div className="relative flex-1 lg:flex-none">
                            <span className="absolute left-1.5 lg:left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₦
                            </span>
                            <input
                              type="number"
                              min={0}
                              className="w-full lg:w-28 border border-gray-200 rounded-lg pl-4 lg:pl-6 pr-1 lg:pr-2 py-1 lg:py-1.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              placeholder="0"
                              value={grid[key] ?? ""}
                              onChange={(e) => handleChange(cls, ft._id, e.target.value)}
                            />
                          </div>
                          <button
                            disabled={isSavingThis || saving}
                            onClick={() => handleSaveCell(cls, ft._id)}
                            className={`px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                              isSaved
                                ? "bg-emerald-500 text-white"
                                : "bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50"
                            }`}
                          >
                            {isSavingThis ? "..." : isSaved ? "✓" : "Save"}
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          * Amounts shown in Nigerian Naira (₦). Changes apply to the current active session only.
        </p>
      </div>
    </div>
  );
}
