"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function ExpectedFeesCard({
amount,
loadingState
}:{amount:number,loadingState:boolean}) {

return (

<div className="px-5 w-90 h-50 mb-10 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-3">

{loadingState ? <LoadingSpinner/> :

<>
<div className="flex justify-between">

<p className="text-gray-500">Fees Expected</p>

<span className="p-2 rounded-full bg-purple-100">
<FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-purple-700"/>
</span>

</div>

<h1 className="font-bold text-3xl">
₦{amount.toLocaleString()}
</h1>

<p className="text-gray-500">
Total fees expected this session
</p>

</>

}

</div>

)

}