import { Student, StudentTableProps } from "@/types/student";
import { useState } from "react";
import FeesStatusToggle from "./FeesStatusToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteStudentModal from "./DeleteStudentModal";
import EditStudentModal from "./EditStudentModal";


export default function StudentRow({
    serial,
    student,
    onDelete,
    onRefresh,
}: {
   serial: number,
    student: Student,
    onDelete: (id: string) => void,
    onRefresh: () => void,
 
}) {
    const [showDelete , setShowDelete] = useState<boolean>(false);
    const [showEdit , setShowEdit] = useState<boolean>(false);

    return (
       <>
        <tr className="border-b">
        <td className="p-4  w-10">{serial}</td>
        <td className="p-4 w-40">{student.studentName}</td>
        <td className="p-4 w-40">{student.studentId}</td>
        <td className="p-4 w-40">{student.className}</td>
        <td className="p-4 w-40">{student.section || "-"}</td>
        <td className="p-4 w-40">{student.parentName || "-"}</td>
        <td className="p-4 w-40">{student.parentPhone || "-"}</td>
        <td className="p-4 w-40">{student.parentEmail || "-"}</td>

        <td className="p-4 w-40">
            <FeesStatusToggle
              studentId={student._id}
              currentStatus={student.feesStatus}
              onUpdated={onRefresh}
            />
        </td>

         <td className="p-4  w-40">{student.smsStatus || "NOTSENT"}</td>
          
         <td className="p-4 w-40 items-center text-center flex justify-center gap-4">
            <FontAwesomeIcon 
             icon={faEdit}
             onClick = {() => setShowEdit(true)}
             className="cursor-pointer hover:opacity-50 text-blue-700 bg-blue-100 p-2 rounded-full"
            />

            <FontAwesomeIcon
             icon={faTrash}
             onClick = {() => setShowDelete(true)}
             className="cursor-pointer hover:opacity-50 text-red-600 bg-red-100 p-2 rounded-full"
            />
         </td>
        </tr>

        <DeleteStudentModal
          open={showDelete}
          studentName={student.studentName}
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            onDelete(student._id);
            setShowDelete(false);
          }}
          
        />

        <EditStudentModal
          open={showEdit}
          student={student}
          onClose={() => setShowEdit(false)}
          onUpdated={onRefresh}
        />
       </>
    )
}