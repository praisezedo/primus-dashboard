"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function RecentPayments(){

const [payments,setPayments] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

api.get("/api/dashboard/recent-payments")
.then(res=>setPayments(res.data))
.finally(()=>setLoading(false))

},[])

if(loading) return <LoadingSpinner/>

return(

<div className="bg-white p-6 rounded-lg shadow border">

<h2 className="font-bold text-lg mb-4">
Recent Payments
</h2>

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>
<th className="p-2 text-left">Student</th>
<th className="p-2">Class</th>
<th className="p-2">Section</th>
<th className="p-2">Amount</th>
<th className="p-2">Date</th>
</tr>

</thead>

<tbody>

{payments.length === 0 ? 

<tr >
    <td colSpan={5} className="text-center py-6 text-gray-500 text-sm">
        No recent payment made
    </td>
</tr>

:payments.map((p)=>(
<tr key={p._id} className="border-t">

<td className="p-2">
{p.studentId?.studentName || "--"}
</td>

<td className="text-center">
{p.studentId?.className || "--"}
</td>

<td className="text-center">
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

)

}