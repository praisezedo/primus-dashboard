"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function RecentPayments(){

const [payments,setPayments] = useState([] as any[]);
const [loading,setLoading] = useState(true)

useEffect(()=>{

api.get("/api/dashboard/recent-payments")
.then((res: any) => setPayments(res.data))
.finally(() => setLoading(false))

},[])

return(

<div className="bg-white p-4 lg:p-6 rounded-lg shadow border">

<h2 className="font-bold text-base lg:text-lg mb-4 text-black">
Recent Payments
</h2>

<div className="overflow-x-auto">
<table className="w-full text-xs lg:text-sm min-w-150">

<thead className="bg-gray-100">

<tr>
<th className="p-2 text-left text-black">Student</th>
<th className="p-2 text-black">Class</th>
<th className="p-2 text-black">Section</th>
<th className="p-2 text-black">Amount</th>
<th className="p-2 text-black">Date</th>
</tr>

</thead>

<tbody>

{payments.length === 0 ? 

<tr >
    <td colSpan={5} className="text-center py-6 text-gray-500 text-xs lg:text-sm">
        No recent payment made
    </td>
</tr>

:payments.map((p: any)=>(
<tr key={p._id} className="border-t">

<td className="p-2 text-black font-medium">
{p.studentId?.studentName || "--"}
</td>

<td className="text-center text-black">
{p.studentId?.className || "--"}
</td>

<td className="text-center text-black">
{p.studentId?.section || "--"}
</td>

<td className="text-center text-green-600 font-medium">
₦{p.amount.toLocaleString()}
</td>

<td className="text-center text-gray-500">
{new Date(p.createdAt).toLocaleDateString()}
</td>

</tr>
))}

</tbody>

</table>
</div>

</div>

)

}