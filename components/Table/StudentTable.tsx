import { StudentTableProps } from "@/types/student";
import StudentRow from "../UI/StudentRow";

export default function StudentTable({
        students,
        onDelete,
        onRefresh,
}: StudentTableProps) {
    return (
        <section className="relative overflow-x-scroll flex mx-7 p-3 flex-col gap-4 border border-gray-200 shadow-sm rounded-md">
           <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">Student Records</h1>
                <p className="text-gray-500">
                    Displaying {students.length} student(s)
                </p>
           </div>

           <table className="text-center justify-center w-fit">
            <thead>
                <tr>
            <td className="p-4 w-10 font-bold">S/N</td>      
            <th className="p-4 w-40">Student Name</th>
            <th className="p-4 w-40">Student ID</th>
            <th className="p-4 w-40">Class</th>
            <th className="p-4 w-40">Section</th>
            <th className="p-4 w-40">Parent Name</th>
            <th className="p-4 w-40">Parent Phone</th>
            <th className="p-4 w-40">Parent Email</th>
            <th className="p-4 w-40">Fees Status</th>
            <th className="p-4 w-40">SMS Status</th>
            <th className="p-4 w-40 font-bold">Actions</th>
                </tr>
            </thead>

            <tbody>
                {students.map(( student , index) => (
                    <StudentRow
                     serial={index + 1}
                     key={student._id}
                     student={student}
                     onDelete={onDelete}
                     onRefresh={onRefresh}
                   
                    />
                ))}

                {
                    students.length === 0 && (
                        <tr>
                            <td colSpan={10} className="p-4 text-gray-500 font-bold">
                                No student found
                            </td>
                        </tr>
                    )
                }
            </tbody>
           </table>
        </section>
    )
}