"use client";

import api from "@/lib/axios";
import { BulkUploadLogs } from "@/types/bulkuploadlog";
import { useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";



export default function BulkUploadReview() {
    const [logs , setLogs] = useState<BulkUploadLogs[]>([]);
    const [loading , setLoading] = useState<boolean>(true);
    const [stats , setStats] = useState({
        totalUploads: 0,
        successCount: 0,
        failedCount: 0,
    });

    useEffect(() => {
        api.get("/api/students/bulk-upload/logs")
        .then((res) => {
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
            <h2 className="font-bold text-lg">Bulk Upload Review</h2>
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
                        <td className="p-2">Date</td>
                        <td className="p-2">Status</td>
                        <td className="p-2">Rows</td>
                        <td className="p-2">Inserted</td>
                        <td className="p-2">Notify</td>
                        <td className="p-2">Error</td>
                    </tr>
                </thead>

                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id} className="border-b">
                            <td className="p-2">{new Date(log.createdAt).toLocaleDateString()}</td>
                            <td className={`p-2 font-bold ${log.status === "SUCCESS" ? "text-green-900" : "text-red-600"}`}>{log.status}</td>
                            <td className="p-2">{log.totalRows}</td>
                            <td className="p-2">{log.insertedRows}</td>
                            <td className="p-2">{log.notifyParents ? "Yes" : "No"}</td>
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