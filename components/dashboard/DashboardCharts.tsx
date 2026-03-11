"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import {
 PieChart,
 Pie,
 BarChart,
 Bar,
 XAxis,
 YAxis,
 ResponsiveContainer,
 Tooltip,
 Cell,
 Legend
} from "recharts";
import LoadingSpinner from "../UI/LoadingSpinner";
import OutstandingStudentsTable from "./OutstandingStudentsTable";
import Link from "next/link";
import RecentPayments from "./RecentPayments";

export default function DashboardCharts() {

const [data,setData] = useState<any>(null)
const [loading,setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(()=>{

api.get("/api/dashboard/overview/chart")
.then(res => {
  if (res.data) {
    setData(res.data)
    setError(null)
  }
})
.catch((err) => {
  console.error("Chart error:", err)
  setError("Failed to load chart data")
})
.finally(()=>setLoading(false))

},[])

if(loading) return <LoadingSpinner/>

if(error) return (
  <div className="bg-white p-6 rounded-lg shadow border">
    <p className="text-center text-red-600 font-semibold">{error}</p>
    <p className="text-center text-gray-500 text-sm mt-2">Please refresh the page or contact support</p>
  </div>
)

if(!data || !data.feeTotals) return (
  <div className="bg-white p-6 rounded-lg shadow border">
    <p className="text-center text-gray-500">No fee data available. Please ensure students and fee types are configured.</p>
  </div>
)


/* ----------------------------
FEES OVERVIEW
-----------------------------*/

const totalPaid = data.feeTotals.totalPaid
const totalBalance = data.feeTotals.totalBalance
const totalExpected = data.feeTotals.totalExpected || (totalPaid + totalBalance)
const totalFees = totalPaid + totalBalance

const collectionRate =
totalFees === 0 ? 0 :
Math.round((totalPaid / totalFees) * 100)

const donutData = [
{
name:"Collected",
value:totalPaid,
color:"#16a34a"
},
{
name:"Outstanding",
value:totalBalance,
color:"#dc2626"
}
]


/* ----------------------------
CLASS DATA
-----------------------------*/

const classData = data.classFees || []

return (

<div className="flex flex-col gap-6 w-full px-6 pb-10">



<div className="bg-white p-6 rounded-lg shadow border flex flex-col gap-6">

<div className="flex justify-between items-center">

<h2 className="font-bold text-lg">
Fees Overview
</h2>

<span className="text-sm text-gray-500">
Collection Rate: <span className="font-semibold text-green-600">{collectionRate}%</span>
</span>

</div>

<div className="flex items-center justify-center">

<ResponsiveContainer width="100%" height={320}>

<PieChart>

<Pie
data={donutData}
dataKey="value"
nameKey="name"
cx="50%"
cy="50%"
innerRadius={80}
outerRadius={120}
paddingAngle={4}
>

{donutData.map((entry,index)=>(
<Cell key={index} fill={entry.color}/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>


{/* LEGEND */}

<div className="flex flex-col gap-4">
<div className="grid grid-cols-3 gap-4 text-sm">
<div className="bg-blue-50 p-3 rounded-lg">
  <p className="text-gray-600">Expected</p>
  <p className="font-semibold text-lg">₦{totalExpected.toLocaleString()}</p>
</div>

<div className="bg-green-50 p-3 rounded-lg">
  <p className="text-gray-600">Paid (Collected)</p>
  <p className="font-semibold text-lg text-green-600">₦{totalPaid.toLocaleString()}</p>
</div>

<div className="bg-red-50 p-3 rounded-lg">
  <p className="text-gray-600">Outstanding</p>
  <p className="font-semibold text-lg text-red-600">₦{totalBalance.toLocaleString()}</p>
</div>
</div>

<div className="flex justify-center gap-10 text-sm border-t pt-4">
<div className="flex items-center gap-2">
<div className="w-3 h-3 bg-green-600 rounded-full"/>
<p>Collected</p>
<span className="font-semibold">
₦{totalPaid.toLocaleString()}
</span>
</div>

<div className="flex items-center gap-2">
<div className="w-3 h-3 bg-red-600 rounded-full"/>
<p>Outstanding</p>
<span className="font-semibold">
₦{totalBalance.toLocaleString()}
</span>
</div>
</div>
</div>

</div>


<div className="bg-white p-6 rounded-lg shadow border flex flex-col gap-4">

<h2 className="font-bold text-lg">
Fees Performance by Class
</h2>

<div className="w-full overflow-x-auto">

<ResponsiveContainer
width={Math.max(classData.length * 150,600)}
height={350}
>

<BarChart
data={classData}
barGap={8}
barCategoryGap={20}
>

<XAxis
dataKey="className"
tick={{fontSize:12}}
/>

<YAxis
allowDecimals={false}
/>

<Tooltip 
cursor={{ fill: 'rgba(0,0,0,0.05)' }}
contentStyle={{
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '8px'
}}
formatter={(value: any) => {
  if (typeof value === 'number') {
    return `₦${value.toLocaleString()}`;
  }
  return value;
}}
/>

<Bar
dataKey="expected"
fill="#3b82f6"
barSize={20}
name="Expected"
/>

<Bar
dataKey="paid"
fill="#16a34a"
barSize={20}
name="Collected"
/>

<Bar
dataKey="balance"
fill="#dc2626"
barSize={20}
name="Outstanding"
/>

<Legend />

</BarChart>

</ResponsiveContainer>

</div>

</div>

<OutstandingStudentsTable/>

<Link className="font-bold justify-end flex hover:underline" href={'/students'}>View All Students →</Link>

<RecentPayments/>


<div className="bg-white p-6 rounded-lg shadow border flex flex-col gap-4 xl:col-span-2">

<h2 className="font-bold text-lg">
Financial Insights
</h2>

<div className="grid md:grid-cols-4 gap-6">

<div className="flex flex-col gap-1">

<p className="text-gray-500 text-sm">
Total Expected Fees
</p>

<p className="font-bold text-2xl text-blue-600">
₦{totalExpected.toLocaleString()}
</p>

</div>

<div className="flex flex-col gap-1">

<p className="text-gray-500 text-sm">
Total Fees Collected
</p>

<p className="font-bold text-2xl text-green-600">
₦{totalPaid.toLocaleString()}
</p>

</div>

<div className="flex flex-col gap-1">

<p className="text-gray-500 text-sm">
Outstanding Fees
</p>

<p className="font-bold text-2xl text-red-600">
₦{totalBalance.toLocaleString()}
</p>

</div>

<div className="flex flex-col gap-1">

<p className="text-gray-500 text-sm">
Collection Rate
</p>

<p className="font-bold text-2xl text-blue-600">
{collectionRate}%
</p>

</div>

</div>

</div>

</div>

);

}