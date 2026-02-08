import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons"

export default function SentSMS() {
        return <>
        <div className="px-5 w-90 h-50 mb-10 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-3">  
            
            
        <div className="flex justify-between">  
        <p className="text-gray-500">SMS Sent</p>
        <span className="p-2 rounded-full bg-green-100"><FontAwesomeIcon icon={faEnvelopesBulk} className="w-5 h-5 text-green-700"/></span>  
         </div>
            <h1 className="font-bold text-3xl">0</h1>
              <p className="text-gray-500">Total Sent SMS</p> 
          </div>
    </>
}