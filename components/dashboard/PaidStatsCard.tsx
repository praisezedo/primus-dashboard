import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import LoadingSpinner from "../UI/LoadingSpinner";


export default function PaidStatsCard(props: { paidStudents: number , loadingState: boolean}) {

    return <>
    <div className="px-5 w-90 h-50 mb-10 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-3">  
        {props.loadingState ? <LoadingSpinner/>: 
        <React.Fragment>
    <div className="flex justify-between">  
    <p className="text-gray-500">Paid Students</p>
    <span className="p-2 rounded-full bg-green-100"><FontAwesomeIcon icon={faDollar} className="w-5 h-5 text-green-700"/></span>  
     </div>
        <h1  className="font-bold text-3xl" >{props.paidStudents}</h1>
          <p className="text-gray-500">All Paid Students</p> 
        </React.Fragment>
        }

      </div>
    </>
}