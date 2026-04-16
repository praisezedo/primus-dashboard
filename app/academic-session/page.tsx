"use client";

import PrimusLogo from "@/components/UI/PrimusLogo";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AcademicSessionSignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/session/create", { name });
      toast.success("Academic session created successfully");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create academic session");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="w-full max-w-md gap-10 flex flex-col items-center border px-4 md:px-7 py-10 rounded-lg shadow bg-white">
      <PrimusLogo />
      <h1 className="font-bold text-2xl text-black text-center">Set Academic Session</h1>

      <form onSubmit={createSession} className="flex flex-col gap-5 w-full">
        <input
          className="rounded-lg border p-3 w-full text-black"
          placeholder="e.g. 2024/2025"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="bg-blue-700 hover:opacity-50 text-white p-3 rounded-lg w-full"
        >
          {loading ? "Creating..." : "Start Session"}
        </button>
      </form>
    </div>
    </div>
  );
}
