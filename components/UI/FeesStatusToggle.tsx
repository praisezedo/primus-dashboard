"use client";

import { useState } from "react";
import api from "@/lib/axios";

type FeesStatus = "PAID" | "UNPAID";

interface FeesStatusToggleProps {
  studentId: string;
  currentStatus: FeesStatus;
  onUpdated?: (newStatus: FeesStatus) => void;
}

export default function FeesStatusToggle({
  studentId,
  currentStatus,
  onUpdated,
}: FeesStatusToggleProps) {
  const [status, setStatus] = useState<FeesStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
    const newStatus: FeesStatus =
      status === "PAID" ? "UNPAID" : "PAID";

    try {
      setLoading(true);
      await api.put(`/api/students/${studentId}`, {
        feesStatus: newStatus,
      });

      setStatus(newStatus);
      onUpdated?.(newStatus);
    } catch (err) {
      console.error("Failed to update fees status", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className={`hover:opacity-50 px-3 py-1 rounded-full text-sm font-semibold transition
        ${
          status === "PAID"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
    >
      {loading ? "..." : status}
    </button>
  );
}
