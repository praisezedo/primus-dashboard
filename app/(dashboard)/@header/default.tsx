"use client";
import {FontAwesomeIcon} from  '@fortawesome/react-fontawesome';
import {faBell} from  '@fortawesome/free-regular-svg-icons';
import {faUser as faUserSolid} from '@fortawesome/free-solid-svg-icons';

import PrimusLogo from '@/components/UI/PrimusLogo';
export default function Header() {
    return <>
      <header className=" border-b border-gray-200 bg-white p-2  z-70 justify-between fixed top-0 left-0 right-0 ">
        <div className='flex justify-between items-center'>
      <h1><PrimusLogo/></h1>

<div className='flex gap-7 items-center'>
<div className='flex gap-7'>
   <div className='relative inline-block group'>
  <span className="absolute bottom-full hidden group-hover:block bg-blue-700 right-1 z-80 text-white text-xs px-2  py-1 top-0.3 rounded whitespace-nowrap">Profile</span>
 <FontAwesomeIcon className='w-10 h-10 text-2xl text-blue-700' icon={faUserSolid}/>
 </div>
<h1 className='font-bold'>Primus Academy.</h1>
</div>
        </div>
        </div>
      </header>
    </>
}