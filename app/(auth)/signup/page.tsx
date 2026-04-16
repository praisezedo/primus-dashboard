"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faLock , faLockOpen } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import PrimusLogo from "@/components/UI/PrimusLogo"
import { useReducer , useState } from "react";
import { FormState , FormAction } from "@/components/types/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


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
const[show , setShow] = useState(false)
const [state , dispatch] = useReducer(reducer , intitalState);
const [loading , setLoading] = useState(false);

async function handleSignUp (e: React.FormEvent) {
   e.preventDefault();
   try {
      setLoading(true);
   const res = await fetch("/api/auth/signup" , {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(state)
   }) 

   const data = await res.json();

   setLoading(false);
   if(!res.ok) {
      if(data.message ===  "Admin already exists" ) {
          router.push('/login')
      } 
    toast.error(data.message);

   }  else {
       toast.success(data.message);  
       router.push("/login");
   }
   }  catch (err) {
         console.log('error' , err);
   }
}
     return (
        <>
<div className="min-h-screen bg-white flex items-center justify-center p-4">
<div className="w-full max-w-4xl gap-7 rounded-lg border border-gray-300  shadow-lg py-7 px-4 md:px-7  flex flex-col items-center  justify-center bg-white">
   <div className="gap-5 flex justify-center text-center flex-col">
  <h1><PrimusLogo/></h1>
  <h1 className="py-1 font-bold text-2xl md:text-3xl text-black">Sign Up</h1>
  <p className="font-bold text-lg text-black">Create your school administrator account</p>
     </div>
        <form className="flex flex-col gap-7 w-full" onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
            <label className="font-bold text-black" htmlFor="admin-name">Admin Name</label>
            <input 
             className="focus:outline-none focus:border-none w-full border border-gray-300 shadow-sm p-3 rounded-lg text-black" 
             type="text" name="adminName" id="admin-name" 
             placeholder="Enter your full name.."
             value={state.adminName}
             onChange={(e) => {dispatch({type: "UPDATE_FIELD" , field: "adminName" , value: e.target.value})}}
             />
           </div>
           <div className="flex flex-col gap-2">
            <label className="font-bold text-black" htmlFor="school-name">School Name</label>
            <input className="focus:outline-none focus:border-none w-full border border-gray-300 shadow-sm p-3 rounded-lg text-black" 
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
            <label className="font-bold text-black" htmlFor="">Admin Email</label>
            <span className="w-full border shadow-sm p-3 rounded-lg flex items-center gap-3 border-gray-300">
              <FontAwesomeIcon icon={faEnvelope} className={'w-5 h-5 text-sm text-gray-500'}/>
              <input className="focus:outline-none focus:border-none flex-1 text-black" 
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
      <label className="font-bold text-black" htmlFor="admin-password">Password</label>
       <span className="w-full border shadow-sm p-3 rounded-lg flex items-center gap-3 border-gray-300">
       <span className="hover:opacity-50 cursor-pointer" onClick={() => setShow(!show)}>{show ? <FontAwesomeIcon icon={faLockOpen} className={'w-5 h-5 text-sm text-gray-500'}/> : <FontAwesomeIcon icon={faLock} className={'w-5 h-5 text-sm text-gray-500'}/>}</span>
       <input  className="focus:outline-none focus:border-none flex-1 text-black" 
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

 {/* IMPORTANT WARNING */}
<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start text-sm text-red-700 w-full">
  <span className="text-lg">⚠️</span>
  <div className="space-y-1">
    <p className="font-semibold">Important Notice</p>
    <p>
      Please make sure you remember your admin email and password.
      In Primus v1, there is currently no password recovery option.
    </p>
    <p>
      We strongly recommend writing it down or storing it safely.
    </p>
  </div>
</div>

<button disabled={loading} type="submit" className="disabled:opacity-50 hover:bg-blue-500 bg-blue-700 text-white text-lg rounded-lg p-3 w-full">{loading ? "Signing Up....": "Create School Account"}</button>
          </form>
<span className="flex gap-1 text-black">
    <p>Already have an account?</p>
    <Link className="text-blue-500 hover:text-blue-200" href={'/login'}>Log In</Link>
</span>
       </div>
       </div>
        </>
     )
}