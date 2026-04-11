"use client";
import { Student } from "@/components/types/student";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import api from "@/lib/axios";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";
import DeleteStudentModal from "./DeleteStudentModal";
import EditStudentModal from "./EditStudentModal";
import StudentFeesModal from "./StudentFeesModal";

export default function StudentRow({
    serial,
    student,
    onDelete,
    onRefresh,
    deleting,
}: {
   serial: number,
    student: Student,
    onDelete: (id: string) => void,
    onRefresh: () => void,
    deleting: boolean
})


{
    const [showDelete , setShowDelete] = useState<boolean>(false);
    const [showEdit , setShowEdit] = useState<boolean>(false);
    const [showFees , setShowFees] = useState<boolean>(false);
    const [showSendConfirm, setShowSendConfirm] = useState<boolean>(false);
    const [sendingSms, setSendingSms] = useState<boolean>(false);

    async function handleSendSms() {
      try {
        setSendingSms(true);
        const response = await api.post("/api/sms/students", {
          studentId: student._id,
        });

        const sent = response.data.sent || 0;
        const failed = response.data.failed || 0;
        if (sent > 0) {
          toast.success(`SMS sent to ${student.parentPhone}`);
        } else {
          toast.error(`SMS could not be delivered`);
        }

        onRefresh();
        setShowSendConfirm(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message || "Failed to send SMS");
      } finally {
        setSendingSms(false);
      }
    }

    return (
       <>
        <tr className="border-b">
        <td className="p-4  w-10">{serial}</td>
        <td className="p-4 w-50">{student.studentName}</td>
        <td className="p-4 w-40">{student.studentId}</td>
        <td className="p-4 w-40">{student.className}</td>
        <td className="p-4 w-40">{student.section || "-"}</td>
        <td className="p-4 w-40">{student.parentName || "-"}</td>
        <td className="p-4 w-40">{student.parentPhone || "-"}</td>
        <td className="p-4 w-40">{student.parentEmail || "-"}</td>

        <td className={`p-4 w-20 `}> 
          <p className={`font-bold text-sm p-2 rounded-full ${
          student.smsStatus === "PENDING" ? "text-yellow-600 bg-yellow-100" :
          student.smsStatus === "FAILED" ? "text-red-600 bg-red-100" :
          student.smsStatus === "SENT" ? "text-green-600 bg-green-100" :
          "text-gray-600"
          }`}>
          {student.smsStatus || "Not Sent"}
          </p>
        </td>



         <td className="p-4 w-80 flex gap-3 items-center justify-center align-middle">
          <FontAwesomeIcon 
           icon={faEdit}
           onClick={() => setShowEdit(true)}
           className="cursor-pointer hover:opacity-50 text-black border p-2 rounded-full"
          />

          <FontAwesomeIcon 
           icon={faTrash}
           onClick={() => setShowDelete(true)}
           className={`cursor-pointer hover:opacity-50 text-black border p-2 rounded-full ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />

          <button
            onClick={() => setShowSendConfirm(true)}
            disabled={sendingSms}
            className="border hover:opacity-50 text-black px-2 py-2 rounded text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            {sendingSms ? 'Sending...' : 'Send SMS'}
          </button>

          <button
            onClick={() => setShowFees(true)}
            className="border hover:opacity-50 text-black px-2 py-1 rounded text-sm"
          >
            Fees
          </button>

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
          deleting={deleting}
        />

        <EditStudentModal
          open={showEdit}
          student={student}
          onClose={() => setShowEdit(false)}
          onUpdated={onRefresh}
        />

        <StudentFeesModal
         open={showFees}
         studentId={student._id}
         studentName={student.studentName}
         studentClass={student.className}
         onClose={() => setShowFees(false)}
        />

        <ConfirmModal
          open={showSendConfirm}
          title={`Send SMS to ${student.studentName}`}
          message={`Send a fee notification SMS to ${student.parentName || "the parent"} at ${student.parentPhone}?`}
          confirmLabel="Send SMS"
          cancelLabel="Cancel"
          onClose={() => setShowSendConfirm(false)}
          onConfirm={handleSendSms}
          loading={sendingSms}
        />
       </>
    )
}