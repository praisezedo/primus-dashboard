"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faLock , faLockOpen } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import PrimusLogo from "@/components/UI/PrimusLogo"
import { useReducer , useState } from "react";
import { FormState , FormAction } from "@/types/admin";
import { useRouter } from "next/navigation";


 const intitalState: FormState = {
          adminName: "",
          adminEmail: "",
          schoolName: "",
          adminPassword: ""
 };

 const reducer = (state: FormState, action: FormAction ) => {
      switch (action.type) {
          case "UPDATE_FIELD":
             return {...state , [action.field]: action.value}
          case "RESET":
               return intitalState;
          default:
             return state;        
      };
 }
export default function SignupPage () {
   const router = useRouter();
   const[show , setShow] = useState<boolean>(false)
const [state , dispatch] = useReducer(reducer , intitalState);

async function handleSignUp (e: React.FormEvent) {
   e.preventDefault();

   const res = await fetch("/api/auth/signup" , {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(state)
   }) 

   const data = await res.json();

   if(!res.ok) {
      alert(data.message)
      if(data.message ===  "Admin already exists" ) {
       router.push('/login')
      }
      return;
   }

   router.push('/login')
}
     return (
        <>
<div className="gap-7 rounded-lg border border-gray-300  shadow-lg p-7 flex flex-col items-center justify-center">
   <div className="gap-5 flex justify-center text-center flex-col">
  <h1><PrimusLogo/></h1>
  <h1 className="py-1 font-bold text-3xl">Sign Up</h1>
  <p className="font-bold text-lg">Create your school administrator account</p>
     </div>
        <form className="flex flex-col gap-7" onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="admin-name">Admin Name</label>
            <input 
             className="focus:outline-none focus:border-none w-80 border border-gray-300 shadow-sm p-3 rounded-lg" 
             type="text" name="adminName" id="admin-name" 
             placeholder="Enter your full name.."
             value={state.adminName}
             onChange={(e) => {dispatch({type: "UPDATE_FIELD" , field: "adminName" , value: e.target.value})}}
             />
           </div>
           <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="school-name">School Name</label>
            <input className="focus:outline-none focus:border-none w-80 border border-gray-300 shadow-sm p-3 rounded-lg" 
            type="text" name="schoolName" id="school-name" 
            placeholder="Enter your school's name.."
             value={state.schoolName}

             onChange={(e) => dispatch({
               type: "UPDATE_FIELD",
               field: "schoolName",
               value: e.target.value,
             })}
            />
           </div>

           <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="">Admin Email</label>
            <span className="w-80 border shadow-sm p-3 rounded-lg flex items-center gap-3 border-gray-300">
              <FontAwesomeIcon icon={faEnvelope} className={'w-5 h-5 text-sm'}/>
              <input className="focus:outline-none focus:border-none " 
              type="text" name="adminEmail" id="admin-email"
               placeholder="e.g ., admin@gmail.com ..."
               value={state.adminEmail}

               onChange={(e) => dispatch({
                  type: "UPDATE_FIELD",
                  field: "adminEmail",
                  value: e.target.value
               })}
                />
            </span>
           </div>

      <div className="flex flex-col gap-2">
      <label className="font-bold" htmlFor="admin-password">Password</label>
       <span className="w-80 border shadow-sm p-3 rounded-lg flex items-center gap-3 border-gray-300">
       <span className="hover:opacity-50" onClick={() => setShow(!show)}>{show ? <FontAwesomeIcon icon={faLockOpen} className={'w-5 h-5 text-sm'}/> : <FontAwesomeIcon icon={faLock} className={'w-5 h-5 text-sm'}/>}</span>
       <input  className="focus:outline-none focus:border-none " 
         type={show ? "text" : "password"}
        name="adminPassword" 
        id="adminPassword"
        placeholder="*********"
        value={state.adminPassword}
        onChange={(e) => dispatch({
          type: "UPDATE_FIELD",
          field: "adminPassword",
          value: e.target.value
        })}
        />
      </span>
</div>
      </div>

<button type="submit" className="hover:bg-blue-500 bg-blue-700 text-white text-lg rounded-lg p-3">Create School Account</button>
          </form>
<span className="flex gap-1">
    <p>Already have an account?</p>
    <Link className="text-blue-500 hover:text-blue-200" href={'/login'}>Log In</Link>
</span>
       </div>
        </>
     )
}