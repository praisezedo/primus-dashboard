"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PrimusLoader from "../UI/PrimusLoader";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function DashboardCharts() {
  const [data, setData] = useState<any>(null);
  const [loading , setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get("/api/dashboard/overview/chart").then((res) => {
      setData(res.data);
    })
    .finally(() => setLoading(false));
  }, []);

  if (!data) return null;

  const feesStatus = [
    { name: "PAID", value: data.fees.PAID, fill: "#2563eb" },
    { name: "UNPAID", value: data.fees.UNPAID, fill: "#dc2626" },
  ];

  if (loading) {

    return <LoadingSpinner/>
  }

  if (data.totalStudents === 0) {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg=white p-6 rounded-lg shadow flex items-center justify-center h-62.5 text-gray-500">
                No studends yet 
            </div>

            <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-62.5 text-gray-500">
                No studends yet 
            </div>
        </div>
    )
  }

  const renderLabel = ({name , value}: any) => `${name}: ${value}`;
  
  return (
    <div className="grid grid-cols-1 gap-6 w-full">
      {/* Fees Status */}
      <div className="bg-white p-5 rounded-lg shadow w-full">
        <h2 className="font-bold mb-3">Fees Status</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={feesStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={renderLabel}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Students by Class */}
      <div className="bg-white p-5 rounded-lg shadow w-full overflow-scroll">
        <h2 className="font-bold mb-3">Student by Class</h2>
<ResponsiveContainer width={Math.max(data.studentByClass.length * 150, 600)} height={300}>
  <BarChart
    data={data.studentByClass}
    barGap={8}
    barCategoryGap={20}
  >
    <XAxis dataKey="className" />
    <YAxis allowDecimals={false} />
    <Tooltip />

    <Bar
      dataKey="PAID"
      fill="#2563eb"
      barSize={24}
      name="PAID"
    />

    <Bar
      dataKey="UNPAID"
      fill="#dc2626"
      barSize={24}
      name="UNPAID"
    />
  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
}
