"use client";

import PrimusLogo from "@/components/UI/PrimusLogo";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AcademicSessionSignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/session/create", { name });
      
      router.push("/settings-setup")
    } catch (err) {
      console.error(err);
      alert("Failed to create academic session");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="mt-20 gap-10 flex flex-col items-center w-120 mx-auto border px-7 py-10 rounded-lg shadow">
      <PrimusLogo />
      <h1 className="font-bold text-2xl">Set Academic Session</h1>

      <form onSubmit={createSession} className="flex flex-col gap-5">
        <input
          className="rounded-lg border p-3 w-80"
          placeholder="e.g. 2024/2025"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="bg-blue-700 text-white p-3 rounded-lg"
        >
          {loading ? "Creating..." : "Start Session"}
        </button>
      </form>
    </div>
  );
}
