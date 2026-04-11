import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function BalanceFeesCard({
amount,
loadingState,
studentsWithDebt,
}:{amount:number,loadingState:boolean , studentsWithDebt: number}) {

return (

<div className="px-4 lg:px-5 w-full max-w-sm h-32 lg:h-40 mb-6 lg:mb-10 rounded-lg border relative border-gray-200 shadow-sm flex flex-col justify-center gap-2 lg:gap-3">

{loadingState ? <LoadingSpinner/> :

<>
<div className="flex justify-between items-center">

<p className="text-gray-500 text-sm lg:text-base">Outstanding Balance</p>

<span className="p-1.5 lg:p-2 rounded-full bg-red-100">
<FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 lg:w-5 lg:h-5 text-red-700"/>
</span>

</div>

<h1 className="font-bold text-2xl lg:text-3xl">
₦{amount.toLocaleString()}
</h1>

<p className="text-gray-500 text-xs lg:text-sm">
{studentsWithDebt?.toLocaleString()} students with outstanding balances.
</p>

</>

}

</div>

)

}