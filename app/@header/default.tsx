import {FontAwesomeIcon} from  '@fortawesome/react-fontawesome';
import {faBell} from  '@fortawesome/free-regular-svg-icons';
import {faUser as faUserSolid} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
export default function Header() {
    return <>
      <header className=" border-b border-gray-200 bg-white p-2 mb-5 z-70 justify-between fixed top-0 left-0 right-0 ">
        <div className='flex justify-between items-center'>
      <h1>
          <svg 
  width="200"
  height="50"
  viewBox="0 0 200 50"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  
  <rect x="0" y="5" width="40" height="40" rx="8" fill="#2563EB"/>
  <line x1="13" y1="5" x2="13" y2="45" stroke="white" strokeWidth="2"/>
  <line x1="26" y1="5" x2="26" y2="45" stroke="white" strokeWidth="2"/>
  <line x1="0" y1="18" x2="40" y2="18" stroke="white" strokeWidth="2"/>
  <line x1="0" y1="31" x2="40" y2="31" stroke="white" strokeWidth="2"/>

  
  <text
    x="55"
    y="33"
    fontFamily="Inter, Arial, sans-serif"
    fontSize="26"
    fontWeight="600"
    fill="#1F2937"
  >
    Primus
  </text>
</svg>
        </h1>

<div className='flex gap-7 items-center'>
<Link href="/notifications"className="relative group inline-block">
<span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Notifications</span>
  <FontAwesomeIcon  className="w-4 h-4 text-blue-700"icon={faBell}/>
</Link>
 <Link className='relative inline-block group' href="/profile">
  <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-1 z-80 text-white text-xs px-2  py-1 top-0.3 rounded whitespace-nowrap">Admin Profile</span>
 <FontAwesomeIcon className='w-7 h-7 text-blue-700' icon={faUserSolid}/>
 </Link>
        </div>
        </div>
      </header>
    </>
}