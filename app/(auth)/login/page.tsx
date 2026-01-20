"use client";
import PrimusLogo from "@/components/UI/PrimusLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";

 export default function LoginPage() {
 const [adminEmail, setAdminEmail] = useState("");
 const [adminPassword, setAdminPassword] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);


async function handleLogin(e: React.FormEvent) {
     e.preventDefault();
     setLoading(true);
     setError("");

     try {
      const res = await fetch("/api/auth/login" , {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            adminEmail,
            adminPassword
        })
     });

     if (!res.ok) {
       const data = await res.json();
       setError(data.message || "Login failed");
       setLoading(false);
       return;
     }

     const data = await res.json();
     window.location.href = "/";
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
}
     return (
        <>
        <div className="w-120 gap-7 rounded-lg items-center flex flex-col justify-center bg-white border border-gray-300 shadow-lg p-7">
            <div className="gap-4 flex flex-col items-center text-center">
            <h1 className="mb-5"><PrimusLogo/></h1>
            <h1 className="font-bold text-3xl">Login</h1>
            </div>  

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <form className="flex flex-col justify-between gap-7" onSubmit={handleLogin}>

                <div className="flex flex-col gap-3">
                <label className="font-bold text-lg"  htmlFor="admin-email">Admin Email</label>
                    <span className="flex p-3 gap-2 rounded-lg  border border-gray-300 shadow-sm  justify-between items-center">
                          <FontAwesomeIcon icon={faEnvelope} className={'text-sm h-5 w-5'}/>
                          <input className="w-80 px-2 items-center justify-center focus:outline-none focus:border-none" type="text" name="admin-email" id="admin-email" placeholder="Enter your email adress.." value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}/>
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="font-bold text-lg" htmlFor="admin-password">Password</label>
                    <span className="flex gap-2 border rounded-lg p-3 border-gray-300 shadow-sm justify-between items-center">
                        <FontAwesomeIcon icon={faLock} className={'text-xs h-5 w-5'}/>
                        <input className="w-80 px-2 items-center justify-center focus:outline-none focus:border-none" type="password"  name="admin-password" id="admin-password"  placeholder="*******" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}/>
                    </span>
                </div>

                <button type="submit" disabled={loading} className="w-100 hover:bg-blue-400 rounded-lg bg-blue-700 text-white p-3 font-bold text-lg disabled:opacity-50">{loading ? "Logging in..." : "Login"}</button>
             </form> 
       <span className="flex gap-1">
        <p >Don't have account?</p>
        <Link className="text-blue-500 hover:text-blue-200" href={'/signup'}>Sign Up</Link>
       </span> 
        </div>
        </>
     )
}