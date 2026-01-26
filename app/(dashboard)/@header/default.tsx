"use client";

import PrimusLogo from "@/components/UI/PrimusLogo";
import { useEffect, useState } from "react";
import SkeletonInlineText from "@/components/UI/SkelectonInlineText";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type Session = {
  _id: string;
  name: string;
  isActive: boolean;
};

export default function Header() {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schoolName, setSchoolName] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");

  useEffect(() => {
    async function fetchHeaderData() {
      try {
        const [headerRes, sessionRes] = await Promise.all([
          api.get("/api/dashboard/headerdata"),
          api.get("/api/session/all"),
        ]);

        setSchoolName(headerRes.data.body.schoolName);

        setSessions(sessionRes.data);

        const active = sessionRes.data.find((s: Session) => s.isActive);
        if (active) setActiveSessionId(active._id);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchHeaderData();
  }, []);


  async function handleSessionChange(sessionId: string) {

    if (sessionId === "new") {
      router.push("/academic-session");
      return;
    }

    try {
      await api.post("/api/session/switch", { sessionId });
        window.location.reload();// refresh dashboard data safely
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white p-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center">
        <PrimusLogo />

          <select
            value={activeSessionId}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="border  border-gray-300 rounded-lg p-2 font-bold focus:outline-none"
          >
            {sessions.map((session) => (
              <option className="font-bold" key={session._id} value={session._id}>
                {session.name} Academic Session {session.isActive ? "(Active)" : ""}
              </option>
            ))}

            <option value="new">➕ Start new academic session</option>
          </select>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <SkeletonInlineText length={10} />
            ) : (
              <span className="font-bold text-white bg-blue-700 py-2 px-4 rounded-full">
                {schoolName.trim()[0]}
              </span>
            )}
            <h1 className="font-bold text-lg">
              {schoolName || <SkeletonInlineText length={12} />}
            </h1>
          </div>

        </div>

      </div>
    </header>
  );
}
