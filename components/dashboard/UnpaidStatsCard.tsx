import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleXmark } from "@fortawesome/free-solid-svg-icons";
export default function UnpaidStatsCard() {
    return <>
    <div className="px-5 w-90 h-50 mb-10 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-3">
        <div className="flex justify-between">  
            <p className="text-gray-500">Unpaid Students</p>
            <span className="p-2 rounded-full bg-red-100"><FontAwesomeIcon icon={faCircleXmark} className="w-5 h-5 text-red-700"/></span>  
        </div>
          <h1  className="font-bold text-3xl" >70</h1>
          <p className="text-gray-500">All Unpaid Students</p> 
      </div>
    </>
}