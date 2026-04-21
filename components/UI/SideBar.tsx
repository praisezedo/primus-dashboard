"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  } from "@fortawesome/free-regular-svg-icons"
import { faBell,  faUsers , faUserPlus , faCloudArrowUp  , faGear , faArrowRightFromBracket , faHouse } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LogOut from "@/components/UI/LogOut";
import api from "@/lib/axios";

interface SideBarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export default function SideBar({ isMobileMenuOpen = false, onMobileMenuClose }: SideBarProps) {
    const [showLogout , setShowLogout] = useState(false);
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;
    const [schoolName , setSchoolName] = useState("");






    // Close mobile menu when route changes
    useEffect(() => {
      if (onMobileMenuClose) {
        onMobileMenuClose();
      }
    }, [pathname, onMobileMenuClose]);

    const handleLinkClick = () => {
      if (onMobileMenuClose) {
        onMobileMenuClose();
      }
    };

    const navigationItems = [
      { href: '/', icon: faHouse, label: 'Dashboard', tooltip: 'Dashboard' },
      { href: '/students', icon: faUsers, label: 'Students', tooltip: 'Students' },
      { href: '/students/add', icon: faUserPlus, label: 'Add Student', tooltip: 'Add Student' },
      { href: '/students/upload', icon: faCloudArrowUp, label: 'Bulk Upload', tooltip: 'Bulk Upload' },
    ];

    const bottomItems = [
      { href: '/settings', icon: faGear, label: 'Settings', tooltip: 'Settings' },
    ];

    return (
      <>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block pt-7 fixed border-r border-gray-200 shadow-md top-17 bg-white bottom-0 left-0 w-50 text-black z-30">
          <nav className="justify-center flex flex-col gap-12 px-7">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                className={`flex gap-3 p-2 text-black rounded-lg hover:cursor-pointer group relative font-bold transition-colors ${
                  isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href={item.href}
              >
                <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.tooltip}
                </span>
                <FontAwesomeIcon className="w-5 h-5 text-blue-700 shrink-0" icon={item.icon}/>
                <h1 className="truncate">{item.label}</h1>
              </Link>
            ))}
          </nav>

          <div className="justify-center flex flex-col gap-10 px-7 mt-7 border-t border-b py-4 border-gray-200">
            {bottomItems.map((item) => (
              <Link
                key={item.href}
                className={`flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold transition-colors ${
                  isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
                href={item.href}
              >
                <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.tooltip}
                </span>
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 text-blue-700 shrink-0"/>
                <span className="font-bold text-black truncate">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={() => setShowLogout(true)}
              className="flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold transition-colors bg-white hover:bg-gray-50"
            >
              <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Logout
              </span>
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5 h-5 text-blue-700 shrink-0"/>
              <span className="font-bold truncate">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu Content (rendered in header overlay) */}
        <div className="lg:hidden">
          {/* Mobile menu is now handled by header component */}
        </div>

        <LogOut open={showLogout} onClose={() => setShowLogout(false)}/>
      </>
    );
}
