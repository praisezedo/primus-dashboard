import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function PaidFeesCard({
amount,
loadingState
}:{amount:number,loadingState:boolean}) {

return (

<div className="px-4 lg:px-5 w-full max-w-sm h-32 lg:h-40 mb-6 lg:mb-10 rounded-lg border relative border-gray-200 shadow-sm flex flex-col justify-center gap-2 lg:gap-3">

{loadingState ? <LoadingSpinner/> :

<>
<div className="flex justify-between items-center">

<p className="text-gray-500 text-sm lg:text-base">Fees Collected</p>

<span className="p-1.5 lg:p-2 rounded-full bg-green-100">
<FontAwesomeIcon icon={faDollar} className="w-4 h-4 lg:w-5 lg:h-5 text-green-700"/>
</span>

</div>

<h1 className="font-bold text-2xl text-black lg:text-3xl">
₦{amount.toLocaleString()}
</h1>

<p className="text-gray-500 text-xs lg:text-sm">
Total fees collected
</p>

</>

}

</div>

)

}