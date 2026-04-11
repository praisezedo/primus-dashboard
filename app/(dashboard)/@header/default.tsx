"use client";

import PrimusLogo from "@/components/UI/PrimusLogo";
import { useEffect, useState } from "react";
import SkeletonInlineText from "@/components/UI/SkelectonInlineText";
import api from "@/lib/axios";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHouse, faUsers, faUserPlus, faCloudArrowUp, faGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import LogOut from "@/components/UI/LogOut";

type Session = {
  _id: string;
  name: string;
  isActive: boolean;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schoolName, setSchoolName] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

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
      toast.success("Academic session switched");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to switch session");
    }
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white p-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center max-w-full mx-auto">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="w-5 h-5 text-blue-700"
            />
          </button>

          {/* Logo - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:block">
            <PrimusLogo />
          </div>

          {/* Mobile Logo Placeholder */}
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-blue-700">Primus</h1>
          </div>

          {/* Session Selector - Responsive */}
          <select
            value={activeSessionId}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 lg:px-3 py-2 text-xs lg:text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all max-w-[120px] lg:max-w-none"
          >
            {sessions.map((session) => (
              <option className="font-bold" key={session._id} value={session._id}>
                {session.name} {session.isActive ? "(Active)" : ""}
              </option>
            ))}
            <option value="new">➕ Start new academic session</option>
          </select>

          {/* Desktop School Info - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <SkeletonInlineText length={10} />
            ) : (
              <span className="font-bold text-white bg-blue-700 py-2 px-4 rounded-full text-sm">
                {schoolName.trim()[0]}
              </span>
            )}
            <h1 className="font-bold text-lg">
              {schoolName || <SkeletonInlineText length={12} />}
            </h1>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
<div className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Primus Logo Icon */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 200 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 lg:w-8 lg:h-8"
                >
                  <rect x="0" y="5" width="40" height="40" rx="8" fill="#2563EB" />
                  <line x1="13" y1="5" x2="13" y2="45" stroke="white" strokeWidth="2" />
                  <line x1="26" y1="5" x2="26" y2="45" stroke="white" strokeWidth="2" />
                  <line x1="0" y1="18" x2="40" y2="18" stroke="white" strokeWidth="2" />
                  <line x1="0" y1="31" x2="40" y2="31" stroke="white" strokeWidth="2" />
                </svg>
                <h1 className="font-bold text-sm lg:text-lg">
                  {schoolName || <SkeletonInlineText length={12} />}
                </h1>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <nav className="flex flex-col gap-3 lg:gap-6 px-4 lg:px-6 py-5 lg:py-6">
              <Link
                className={`flex gap-3 p-2 lg:p-3 rounded-lg hover:cursor-pointer font-bold transition-colors text-sm lg:text-base ${
                  pathname === '/' ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700 shrink-0" icon={faHouse}/>
                <span>Dashboard</span>
              </Link>

              <Link
                className={`flex gap-3 p-2 lg:p-3 rounded-lg hover:cursor-pointer font-bold transition-colors text-sm lg:text-base ${
                  pathname === '/students' ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href="/students"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700 shrink-0" icon={faUsers}/>
                <span>Students</span>
              </Link>

              <Link
                className={`flex gap-3 p-2 lg:p-3 rounded-lg hover:cursor-pointer font-bold transition-colors text-sm lg:text-base ${
                  pathname === '/students/add' ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href="/students/add"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700 shrink-0" icon={faUserPlus}/>
                <span>Add Student</span>
              </Link>

              <Link
                className={`flex gap-3 p-2 lg:p-3 rounded-lg hover:cursor-pointer font-bold transition-colors text-sm lg:text-base ${
                  pathname === '/students/upload' ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href="/students/upload"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700 shrink-0" icon={faCloudArrowUp}/>
                <span>Bulk Upload</span>
              </Link>
            </nav>

            <div className="border-t border-gray-200 px-4 lg:px-6 py-4 lg:py-6">
              <Link
                className={`flex gap-3 p-2 lg:p-3 rounded-lg hover:cursor-pointer font-bold transition-colors mb-3 lg:mb-4 text-sm lg:text-base ${
                  pathname === '/settings' ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faGear} className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700 shrink-0"/>
                <span className="font-bold">Settings</span>
              </Link>

              <button
                onClick={() => {
                  setShowLogout(true);
                  setIsMenuOpen(false);
                }}
                className="flex gap-3 p-2 lg:p-3 rounded-lg hover:cursor-pointer font-bold transition-colors w-full text-left bg-white hover:bg-gray-50 text-sm lg:text-base"
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700 shrink-0"/>
                <span className="font-bold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <LogOut open={showLogout} onClose={() => setShowLogout(false)}/>
    </>
  );
}


