import { useEffect, useState } from "react";
import { StudentDebt } from "../types/student";
import api from "@/lib/axios";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function OutstandingStudentsTable() {
    const [students, setStudents] = useState([] as StudentDebt[]);
    const [loading , setLoading] = useState(true);

    useEffect(() => {

        api.get("/api/dashboard/outstanding-students")
        .then((res: any) => {
            setStudents(res.data.students || []);
        })
        .finally(() => setLoading(false));

    }, []);


  return (

    <div className="bg-white p-6 rounded-lg shadow border flex flex-col gap-4">

      <div className="flex justify-between items-center">

        <h2 className="font-bold text-lg text-black">
          Students With Outstanding Fees
        </h2>

        <span className="text-sm text-gray-500">
          Showing top debtors
        </span>

      </div>

      {students.length === 0 ? (

        <p className="text-gray-500 text-sm">
          No students currently owing fees.
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full text-xs lg:text-sm min-w-150">

            <thead className="border-b text-gray-500">

              <tr>

                <th className="text-left py-3 text-black">Student Name</th>

                <th className="text-left text-black">Class</th>

                 <th className="text-left text-black">Section</th>
                 
                <th className="text-left text-black">Total Fee</th>

                <th className="text-left text-black">Paid</th>

                <th className="text-left text-black">Balance</th>

                <th className="text-left text-black">Status</th>

              </tr>

            </thead>

            <tbody>

              {students.map((student: any,index: number)=>{

                const status =
                  student.totalPaid === 0
                  ? "Unpaid"
                  : "Partial"

                return(

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50  transition"
                  >

                    <td className="py-3 font-medium text-gray-800">
                      {student.studentName || "--"}
                    </td>

                    <td className="text-black">
                      {student.className || "--"}
                    </td>

                     <td className="text-black">
                        {student.section || "--"}
                     </td>

                    <td className="text-black font-semibold">
                      ₦{student.totalAmount.toLocaleString() || "--"}
                    </td>

                    <td className="text-green-600 font-semibold">
                      ₦{student.totalPaid.toLocaleString() || "--"}
                    </td>

                    <td className="text-red-600 font-semibold">
                      ₦{student.balance.toLocaleString() || "--"}
                    </td>

                    <td>

                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                        ${status === "Unpaid"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                      >

                        {status || "--"}

                      </span>

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

      )}

    </div>



  )
}