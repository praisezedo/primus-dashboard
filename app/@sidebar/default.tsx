"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse  } from "@fortawesome/free-regular-svg-icons"
import { faUsers, faUserPlus , faCloudArrowUp  , faGear , faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function SideBar() {
        const pathname = usePathname();
        const isActive = (href: string) => pathname === href;
    return <>
       <aside className="pt-7 fixed border-r border-gray-200 shadow-md top-17 bg-white bottom-0 left-0  w-50 text-black ">
        <nav className="justify-center flex flex-col gap-10 px-7">
           <Link className={`flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold ${isActive('/') ? 'bg-gray-200' : 'bg-white'}`} href="/">
           <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Dashboard</span>
           <FontAwesomeIcon className="w-5 h-5 text-blue-700" icon={faHouse}/> 
           <h1>Dashboard</h1>
           </Link>     
           <Link className={`flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold ${isActive('/students') ? 'bg-gray-200' : 'bg-white'}`} href="/students">
           <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Students</span>
           <FontAwesomeIcon className="w-5 h-5 text-blue-700" icon={faUsers}/>
           <h1>Students</h1>
           </Link>
           <Link className={`flex gap-2 p-2 rounded-lg hover:cursor-pointer group relative font-bold ${isActive('/students/add') ? 'bg-gray-200' : 'bg-white'}`} href="/students/add">
           <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Add Student</span>
           <FontAwesomeIcon className="w-5 h-5 text-blue-700" icon={faUserPlus}/>
           <h1>Add Student</h1>
           </Link>
           <Link className={`flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold ${isActive('/students/upload') ? 'bg-gray-200' : 'bg-white'}`} href="/students/upload">
           <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Bulk Upload</span>
           <FontAwesomeIcon className="w-5 h-5 text-blue-700" icon={faCloudArrowUp}/> 
           <h1>Bulk Upload</h1>
           </Link>
        </nav>

        <div className="justify-center flex flex-col gap-10 px-7 mt-16 border-t border-b py-4  border-gray-200">
            <Link className={`flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold ${isActive('/students/settings') ? 'bg-gray-200' : 'bg-white'}`} href={'/settings'}>
         <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Settings</span>
            <FontAwesomeIcon icon={faGear} className="w-5 h-5 text-blue-700"/>
                <span className="font-bold">Settings</span>
            </Link> 
            <Link className={`flex gap-3 p-2 rounded-lg hover:cursor-pointer group relative font-bold ${isActive('/students/logout') ? 'bg-gray-200' : 'bg-white'}`} href={'/logout'}>
                       <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Logout</span>
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5 h-5 text-blue-700"/>
                <span className="font-bold">Logout</span>
            </Link>   
        </div>
       </aside>
    </>
}