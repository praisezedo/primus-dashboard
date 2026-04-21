"use client";

import api from "@/lib/axios";
import { BulkUploadLogs } from "@/components/types/bulkuploadlog";
import { useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";



export default function BulkUploadReview() {
    const [logs , setLogs] = useState([] as BulkUploadLogs[]);
    const [loading , setLoading] = useState(true);
    const [stats , setStats] = useState({
        totalUploads: 0,
        successCount: 0,
        failedCount: 0,
    });

    useEffect(() => {
        api.get("/api/students/bulk-upload/logs")
        .then((res: any) => {
            setLogs(res.data.logs);
            setStats({
                totalUploads: res.data.totalUploads,
                successCount: res.data.successCount,
                failedCount: res.data.failedCount,
            });
        })
        .finally(() => setLoading(false));
    } , []);

    if (loading) {
        return <LoadingSpinner/>;
    }

 return (
    <section className="mx-5 mt-10 border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex justify-center items-center mb-4 gap-10 font-bold">
            <h2 className="font-bold text-black text-lg">Bulk Upload Review</h2>
            <div className="text-sm text-gray-600 flex gap-4">
                <span>Total: {stats.totalUploads}</span>
                <span className="text-green-700">Success: {stats.successCount}</span>
                <span className="text-red-600">Failed: {stats.failedCount}</span>
            </div>
        </div>

        {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No Bulk uploads yet</p>
        ): (
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-center">
                <thead className="border-b font-semibold">
                    <tr>
                        <td className="p-2 text-black">Date</td>
                        <td className="p-2 text-black">Status</td>
                        <td className="p-2 text-black">Rows</td>
                        <td className="p-2 text-black">Inserted</td>
                        <td className="p-2 text-black">Notify</td>
                        <td className="p-2 text-black">Error</td>
                    </tr>
                </thead>

                <tbody>
                    {logs.map((log: any) => (
                        <tr key={log._id} className="border-b">
                            <td className="p-2 text-black">{new Date(log.createdAt).toLocaleDateString()}</td>
                            <td className={`p-2 font-bold ${log.status === "SUCCESS" ? "text-green-900" : "text-red-600"}`}>{log.status}</td>
                            <td className="p-2 text-black">{log.totalRows}</td>
                            <td className="p-2 text-black">{log.insertedRows}</td>
                            <td className="p-2 text-black">{log.notifyParents ? "Yes" : "No"}</td>
                            <td className="p-2 text-center">
                                {log.status === "FAILED" ? (
                                    <span className="text-red-600">
                                        Rows {log.errorRow}: {log.errorMessage}
                                    </span>
                                ): (
                                    "-"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
               </table>
            </div>
        )} 
    </section>
 )
}