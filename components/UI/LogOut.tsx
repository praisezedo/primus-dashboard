"use client";
import { Props } from "@/components/types/logout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
export default function LogOut({open , onClose}: Props) {

    const router = useRouter();
    const [loading , setLoading] = useState<boolean>(false);

    if (!open) return null;

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);

        try {
           await api.post("/api/auth/logout");
           toast.success("Logged out successfully");
           router.replace("/login");

        } catch (err) {
             console.error(err);
             toast.error("Logging out failed");
        } finally {
            setLoading(false);
        }
    }
    return <>
       <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40"> 
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-7 space-y-5">
                <h2 className="text-xl font-bold">Logout</h2>

                <p className="text-gray-600">
                    Are you sure you want to logout ? 
                </p>

                <div className="flex justify-end gap-3">
                       <button
                        onClick={onClose}
                        className="px-4 py-2  hover:opacity-50 rounded-lg border"
                        disabled={loading}
                       >
                        Cancel
                       </button>

                       <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="px-4 py-2 hover:opacity-50 rounded-lg bg-red-600 text-white disabled:opacity-50"
                       >
                        {loading ? "Logging out..." : "Logout"}
                       </button>
                </div>
            </div>
       </div>
    </>
}