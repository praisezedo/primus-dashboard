"use client";
import { useEffect, useState } from "react";
import { StudentFeeProps } from "../types/student";
import api from "@/lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import React from "react";

export default function StudentFeesModal({
    open,
    studentId,
    studentName,
    studentClass,
    onClose,

}: StudentFeeProps) {
   const [fees , setFees] = useState([] as any[]);
   const [loading , setLoading] = useState(false);
   const [paymentInputs , setPaymentInputs] = useState({} as {[key: string]: number});
   const [paymentHistory , setPaymentHistory] = useState({} as {[key: string]: any[]});
   const [paymentLoadingByFee , setPaymentLoadingByFee] = useState({} as Record<string, boolean>);

async function fetchHistory (feeId: string) {

  const res = await api.get(`/api/fees/history/${feeId}`);

  setPaymentHistory((prev: any) => ({
    ...prev,
    [feeId]: res.data
  }));
}   

async function fetchFees() {
    setLoading(true);
    const res = await api.get(`/api/students/${studentId}/fees`);
    setFees(res.data);

        res.data.forEach((fee: any) => {
      fetchHistory(fee._id);
    })

    setLoading(false);

   }

async function handlePay(fee: any) {

  const amount = paymentInputs[fee._id];

  if (!amount || amount <= 0) {
    toast.error("Enter a valid amount");
    return;
  }

  // Store original fees for potential revert
  const originalFees = [...fees];

  // Optimistic update
  const optimisticFees = fees.map((f: any) => {
    if (f._id === fee._id) {
      const newPaid = f.amountPaid + amount;
      return {
        ...f,
        amountPaid: newPaid,
        balance: f.totalAmount - newPaid,
        status: newPaid >= f.totalAmount ? "PAID" : newPaid > 0 ? "PARTIAL" : "UNPAID"
      };
    }
    return f;
  });
  setFees(optimisticFees);

  try {
    setPaymentLoadingByFee((prev: Record<string, boolean>) => ({ ...prev, [fee._id]: true }));
    await api.post(`/api/fees/pay`, {
      feeId: fee._id,
      amount,
    });

    toast.success("Payment recorded");

    setPaymentInputs((prev: {[key: string]: number}) => ({
      ...prev,
      [fee._id]: 0,
    }));

    // Fetch latest data to confirm
    fetchFees();
  } catch (error) {
    // Revert optimistic update on error
    setFees(originalFees);
    toast.error("Payment failed");
  } finally {
    setPaymentLoadingByFee((prev: Record<string, boolean>) => ({ ...prev, [fee._id]: false }));
  }
}

   useEffect(() => {
    if (open) fetchFees();
   }, [open , studentClass]);

   if (!open ) return null;


     return (
    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4`}>
      <div className="bg-white relative rounded-lg p-4 lg:p-6 w-full max-w-4xl space-y-4 max-h-[90vh] overflow-y-auto">

        <h2 className="text-base lg:text-lg font-bold text-black">
          {studentName} Fees Record
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
<div className="overflow-x-auto">
<table className="w-full border rounded-lg overflow-hidden  text-xs lg:text-sm min-w-200">
  <thead className="bg-gray-100 text-gray-700">
    <tr>
      <th className="p-2 lg:p-3 text-left text-black ">Fee Type</th>
      <th className="p-2 lg:p-3 text-black ">Total</th>
      <th className="p-2 lg:p-3 text-black ">Paid</th>
      <th className="p-2 lg:p-3 text-black ">Balance</th>
      <th className="p-2 lg:p-3 text-black ">Status</th>
      <th className="p-2 lg:p-3 text-black ">Action</th>
    </tr>
  </thead>

  <tbody>
{fees.map((f: any) => (
  < React.Fragment>
 
    <tr key={f._id} className="border-t hover:bg-gray-50">

      <td className="p-2 lg:p-3 text-black text-left font-medium">
        {f.feeTypeId?.name}
      </td>

      <td className="text-center text-black font-medium">
        ₦{f.totalAmount.toLocaleString()}
      </td>

      <td className="text-center text-green-600 font-medium">
        ₦{f.amountPaid.toLocaleString()}
      </td>

      <td className="text-center text-red-500 font-medium">
        ₦{f.balance.toLocaleString()}
      </td>

      <td className="text-center">
        <span
          className={`px-1 lg:px-2 py-0.5 lg:py-1 text-xs rounded-full
          ${
            f.status === "PAID"
              ? "bg-green-100 text-green-700"
              : f.status === "PARTIAL"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {f.status}
        </span>
      </td>

      <td className="text-center">
        {f.balance > 0 && (
          <div className="flex  items-center gap-2 lg:gap-2 justify-center">

            <input
              type="number"
              placeholder="Amount"
              className="border border-black text-black rounded px-1 lg:px-2 py-1 w-16 lg:w-24 text-xs lg:text-sm"
              value={paymentInputs[f._id] || ""}
              onChange={(e) =>
                setPaymentInputs({
                  ...paymentInputs,
                  [f._id]: Number(e.target.value)
                })
              }

              onKeyDown={
                (e) => {
                  if (e.key === "Enter") {
                    handlePay(f);
                  }
                }
              }
            />

            <button
              disabled={paymentLoadingByFee[f._id]}
              onClick={() => handlePay(f)}
              className="bg-blue-500 disabled:opacity-50 text-white px-2 lg:px-3 py-1 rounded text-xs hover:bg-blue-600"
            >
             {paymentLoadingByFee[f._id] ? "..." : "Pay"}
            </button>

          </div>
        )}
      </td>

    </tr>


    {paymentHistory[f._id]?.length > 0 && (
      <tr key={`${f._id}-history`}>
        <td colSpan={6} className="bg-gray-50 p-2 lg:p-3">

          <div className="text-xs space-y-1">

            <p className="font-semibold text-gray-600">
              Payment History
            </p>

            {paymentHistory[f._id].map((p:any)=>(
              <div
                key={p._id}
                className="flex justify-between border-b py-1"
              >

                <span className="text-black ">
                  ₦{p.amount.toLocaleString()}
                </span>

                <span className="text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>

              </div>
            ))}

          </div>

        </td>
      </tr>
    )}
  </React.Fragment>
))}
  </tbody>
</table>
</div>
        )}

        <div className="flex justify-end pt-2 lg:pt-3">
          <button
            onClick={onClose}
            className="border px-3 lg:px-4 py-2 bg-blue-700 text-white rounded hover:opacity-50 text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}