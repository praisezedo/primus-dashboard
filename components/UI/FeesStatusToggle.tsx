"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

type FeesStatus = "PAID" | "UNPAID";

interface FeesStatusToggleProps {
  studentId: string;
  currentStatus: FeesStatus;
  onUpdated?: () => void;
}

export default function FeesStatusToggle({
  studentId,
  currentStatus,
  onUpdated,
}: FeesStatusToggleProps) {
  const [status, setStatus] = useState<FeesStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  } , [currentStatus])

  //toggle status update function 

  const toggleStatus =  async () => {
    const newStatus: FeesStatus =
      status === "PAID" ? "UNPAID" : "PAID";

      //optimistic which was not used due to loading
      const prevStatus = status;

      setStatus(newStatus);

       setLoading(true);
    try {
      
      await api.put(`/api/students/${studentId}`, {
        feesStatus: newStatus,
      });
      console.log("Calling PUT for", studentId);
      setStatus(newStatus);
        onUpdated?.();

    } catch  {
       setStatus(prevStatus);
       toast.error("Error Changing Fees State");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
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
