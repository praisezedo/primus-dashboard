import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function BalanceFeesCard({
amount,
loadingState,
studentsWithDebt,
}:{amount:number,loadingState:boolean , studentsWithDebt: number}) {

return (

<div className="px-5 w-90 h-50 mb-10 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-3">

{loadingState ? <LoadingSpinner/> :

<>
<div className="flex justify-between">

<p className="text-gray-500">Outstanding Balance</p>

<span className="p-2 rounded-full bg-red-100">
<FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-red-700"/>
</span>

</div>

<h1 className="font-bold text-3xl">
₦{amount.toLocaleString()}
</h1>

<p className="text-gray-500">
there are {studentsWithDebt?.toLocaleString()} students with outstanding balances. 
</p>

</>

}

</div>

)

}