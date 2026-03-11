import { useEffect, useState } from "react";
import { StudentDebt } from "../types/student";
import api from "@/lib/axios";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function OutstandingStudentsTable() {
    const [students, setStudents] = useState<StudentDebt[]>([]);
    const [loading , setLoading] = useState<boolean>(true);

    useEffect(() => {

        api.get("/api/dashboard/outstanding-students")
        .then(res => {
            setStudents(res.data.students || []);
        })
        .finally(() => setLoading(false));

    }, []);

    if (loading) return <LoadingSpinner/>;

  return (

    <div className="bg-white p-6 rounded-lg shadow border flex flex-col gap-4">

      <div className="flex justify-between items-center">

        <h2 className="font-bold text-lg">
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

          <table className="w-full text-sm">

            <thead className="border-b text-gray-500">

              <tr>

                <th className="text-left py-3">Student Name</th>

                <th className="text-left">Class</th>

                 <th className="text-left">Section</th>
                 
                <th className="text-left">Total Fee</th>

                <th className="text-left">Paid</th>

                <th className="text-left">Balance</th>

                <th className="text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {students.map((student,index)=>{

                const status =
                  student.totalPaid === 0
                  ? "Unpaid"
                  : "Partial"

                return(

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="py-3 font-medium text-gray-800">
                      {student.studentName || "--"}
                    </td>

                    <td>
                      {student.className || "--"}
                    </td>

                     <td>
                        {student.section || "--"}
                     </td>

                    <td>
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