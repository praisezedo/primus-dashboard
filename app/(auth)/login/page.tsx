import PrimusLogo from "@/components/UI/PrimusLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

 export default function LoginPage() {
     return (
        <>
        <div>
            <div>
            <h1><PrimusLogo/></h1>
            <h1>Login to Primus Admin</h1>
            </div>  

            <form action="POST">

                <div>
                    <label htmlFor="admin-email">Admin Email</label>
                    <span>
                          <FontAwesomeIcon icon={faEnvelope} className={'h-4 w-4'}/>
                          <input type="text" placeholder="Enter your email adress.."/>
                    </span>
                </div>

                <div>
                    <label htmlFor="admin-password">Password</label>
                    <span>
                        <FontAwesomeIcon icon={faLock} className={'h-4 w-4'}/>
                        <input type="text"  name="admin-password" id="admin-password"  placeholder="*******"/>
                    </span>
                </div>

                <button>Login</button>
                </form> 

       <span>
        <p>Don't have account?</p>
        <Link href={'/signup'}>Sign Up</Link>
       </span> 
        </div>
        </>
     )
}