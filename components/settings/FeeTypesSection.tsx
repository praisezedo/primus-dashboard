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
        <div className="border-b border-blue-50 px-6 py-4 bg-linear-to-r from-blue-700 to-blue-600">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTags} className="text-white text-lg" />
            <div>
              <h3 className="text-white font-semibold text-sm">Fee Types</h3>
              <p className="text-blue-200 text-xs">
                Define categories of fees charged in your school (e.g. Tuition, PTA, Development Levy)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Input row */}
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Tuition Fee, PTA Levy"
              value={feeTypeInput}
              onChange={(e) => setFeeTypeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAdd()}
            />
            <button
              onClick={onAdd}
              disabled={saving}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-blue-200 whitespace-nowrap"
            >
              {saving ? "Adding..." : "+ Add"}
            </button>
          </div>

          {/* Fee type list */}
          {feeTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">🏷️</div>
              <p className="text-sm">No fee types yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feeTypes.map((ft) => (
                <div
                  key={ft._id}
                  className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-gray-800">{ft.name}</span>
                    {ft.isActive && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(ft._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm opacity-0 group-hover:opacity-100"
                    title="Delete fee type"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 items-start text-xs text-amber-700">
            <span className="text-base">⚠️</span>
            <p>
              Deleting a fee type will not affect existing student fee records. However,
              it will no longer be available when assigning fees going forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
