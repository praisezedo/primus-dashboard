import {FontAwesomeIcon} from  '@fortawesome/react-fontawesome';
import {faBell} from  '@fortawesome/free-regular-svg-icons';
import {faUser as faUserSolid} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import PrimusLogo from '@/components/UI/PrimusLogo';
export default function Header() {
    return <>
      <header className=" border-b border-gray-200 bg-white p-2  z-70 justify-between fixed top-0 left-0 right-0 ">
        <div className='flex justify-between items-center'>
      <h1><PrimusLogo/></h1>

<div className='flex gap-7 items-center'>
<Link href="/notifications"className="relative group inline-block">
<span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-3 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Notifications</span>
  <FontAwesomeIcon  className="w-4 h-4 text-blue-700"icon={faBell}/>
</Link>
<div className='flex gap-3'>
   <Link className='relative inline-block group' href="/profile">
  <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-1 z-80 text-white text-xs px-2  py-1 top-0.3 rounded whitespace-nowrap">Profile</span>
 <FontAwesomeIcon className='w-7 h-7 text-blue-700' icon={faUserSolid}/>
 </Link>
<h1 className='font-bold'>Primus Academy.</h1>
</div>
        </div>
        </div>
      </header>
    </>
}