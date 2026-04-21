"use client";

import { FeeType } from "../types/feetype";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";



 interface Props {
  feeTypes: FeeType[];
  feeTypeInput: string;
  setFeeTypeInput: (v: string) => void;
  saving: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function FeeTypesSection({
  feeTypes, feeTypeInput, setFeeTypeInput, saving, onAdd, onDelete,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-blue-50 px-4 lg:px-6 py-3 lg:py-4 bg-linear-to-r from-blue-700 to-blue-600">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTags} className="text-white text-base lg:text-lg shrink-0" />
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-xs lg:text-sm">Fee Types</h3>
              <p className="text-blue-200 text-xs lg:text-xs line-clamp-2">
                Define categories of fees charged in your school (e.g. Tuition, PTA, Development Levy)
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 space-y-5">
          {/* Input row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 w-full border border-gray-200 text-black rounded-lg lg:rounded-xl px-2 lg:px-3 py-2 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Tuition Fee, PTA Levy"
              value={feeTypeInput}
              onChange={(e) => setFeeTypeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAdd()}
            />
            <button
              onClick={onAdd}
              disabled={saving}
              className="px-3 lg:px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs lg:text-sm font-medium rounded-lg lg:rounded-xl transition-colors shadow-sm shadow-blue-200 whitespace-nowrap shrink-0"
            >
              {saving ? "Adding..." : "+ Add"}
            </button>
          </div>

          {/* Fee type list */}
          {feeTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-2xl lg:text-3xl mb-2">🏷️</div>
              <p className="text-xs lg:text-sm">No fee types yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
              {feeTypes.map((ft) => (
                <div
                  key={ft._id}
                  className="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 bg-blue-50 border border-blue-100 rounded-lg lg:rounded-xl group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-xs lg:text-sm font-medium text-gray-800 truncate">{ft.name}</span>
                    {ft.isActive && (
                      <span className="text-[9px] lg:text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(ft._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-xs lg:text-sm opacity-0 group-hover:opacity-100 ml-2 shrink-0"
                    title="Delete fee type"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg lg:rounded-xl p-2 lg:p-3 flex gap-2 items-start text-xs text-amber-700">
            <span className="text-base lg:text-lg shrink-0">⚠️</span>
            <p className="text-xs lg:text-sm">
              Deleting a fee type will not affect existing student fee records. However,
              it will no longer be available when assigning fees going forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
