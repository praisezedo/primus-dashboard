import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faLock , faLockOpen } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import PrimusLogo from "@/components/UI/PrimusLogo"
export default function SignupPage() {

     return (
        <>
<div>
   <div>
  <h1> <PrimusLogo/> Admin Sign Up</h1>
  <p>Create your school administrator account</p>
     </div>
        <form action="POST">
           <div>
            <label htmlFor="admin-name">Admin Name</label>
            <input type="text" name="admin-name" id="admin-name" placeholder="Enter your full name.."/>
           </div>
           <div>
            <label htmlFor="school-name">School Name</label>
            <input type="text" name="school-name" id="school-name" placeholder="Enter your school's name.."/>
           </div>

           <div>
            <label htmlFor="">Admin Email</label>
            <span>
              <FontAwesomeIcon icon={faEnvelope} className={'w-4 h-4'}/>
              <input type="text" name="admin-email" id="admin-email" placeholder="e.g ., admin@gmail.com ..."/>
            </span>
           </div>

<div>
    <label htmlFor="admin-password">Password</label>
    <span>
     <FontAwesomeIcon icon={faLock}/>
     <input type="text" name="admin-password" id="admin-password" placeholder="*********" />
    </span>
</div>

<button className="">Create School Account</button>
          </form>
<span>
    <p>Already have an account?</p>
    <Link href={'/login'}>Log In</Link>
</span>
       </div>
        </>
     )
}