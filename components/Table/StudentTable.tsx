import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function StudentTable() {
    return <>
     <section className="relative overflow-x-scroll flex mx-7 p-3 flex-col gap-4 border border-gray-200 shadow-sm rounded-md">
        <div className="flex flex-col gap-2">
            <h1 className="font-bold text-xl">Student Records</h1>
            <p className="text-gray-500">Displaying 5 student(s)</p>
        </div>
        <table className="text-center justify-center w-fit">
            <thead>
                <tr>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Student ID</th>
                     <th className="p-2">Class</th>
                    <th className="p-2">Section</th>
                    <th className="p-2">Parent Name</th>
                    <th className="p-2">Parent Phone</th>
                    <th className="p-2">Parent Email</th>
                    <th className="p-2">Fees Status</th>
                    <th className="p-2">SMS Status</th>
                    <td className="p-2">Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="p-2">John Doe</td>
                    <td className="p-2">STU001</td>
                    <td className="p-2">5th Grade</td>
                    <td className="p-2">A</td>
                    <td className="p-2">Jane Doe</td>
                    <td className="p-2">+1234567890</td>
                    <td className="p-2">jane@example.com</td>
                    <td className="p-2">Paid</td>
                    <td className="p-2">Sent</td>
                    <td className="p-2 gap-1">
                        <FontAwesomeIcon icon={faEdit} className="text-black cursor-pointer w-4 h-4"/>
                        <FontAwesomeIcon icon={faTrash} className="text-red-700 cursor-pointer w-4 h-4 ml-4"/>
                        </td>
                </tr>

                <tr>
                    <td className="p-2">Mary Smith</td>
                    <td className="p-2">STU002</td>
                    <td className="p-2">4th Grade</td>
                    <td className="p-2">B</td>
                    <td className="p-2">Robert Smith</td>
                    <td className="p-2">+1234567891</td>
                    <td className="p-2">robert@example.com</td>
                    <td className="p-2">Paid</td>
                    <td className="p-2">Sent</td>
                    <td className="p-2 gap-1">
                        <FontAwesomeIcon icon={faEdit} className="text-black cursor-pointer w-4 h-4"/>
                        <FontAwesomeIcon icon={faTrash} className="text-red-700 cursor-pointer w-4 h-4 ml-4"/>
                    </td>
                </tr>

                <tr>
                    <td className="p-2">James Johnson</td>
                    <td className="p-2">STU003</td>
                    <td className="p-2">6th Grade</td>
                    <td className="p-2">A</td>
                    <td className="p-2">Lisa Johnson</td>
                    <td className="p-2">+1234567892</td>
                    <td className="p-2">lisa@example.com</td>
                    <td className="p-2">Paid</td>
                    <td className="p-2">Sent</td>
                    <td className="p-2 gap-1">
                        <FontAwesomeIcon icon={faEdit} className="text-black cursor-pointer w-4 h-4"/>
                        <FontAwesomeIcon icon={faTrash} className="text-red-700 cursor-pointer w-4 h-4 ml-4"/>
                    </td>
                </tr>

                <tr>
                    <td className="p-2">Patricia Brown</td>
                    <td className="p-2">STU004</td>
                    <td className="p-2">7th Grade</td>
                    <td className="p-2">C</td>
                    <td className="p-2">Michael Brown</td>
                    <td className="p-2">+1234567893</td>
                    <td className="p-2">michael@example.com</td>
                    <td className="p-2">Paid</td>
                    <td className="p-2">Sent</td>
                    <td className="p-2 gap-1">
                        <FontAwesomeIcon icon={faEdit} className="text-black cursor-pointer w-4 h-4"/>
                        <FontAwesomeIcon icon={faTrash} className="text-red-700 cursor-pointer w-4 h-4 ml-4"/>
                    </td>
                </tr>

                <tr>
                    <td className="p-2">Linda Davis</td>
                    <td className="p-2">STU005</td>
                    <td className="p-2">8th Grade</td>
                    <td className="p-2">B</td>
                    <td className="p-2">David Davis</td>
                    <td className="p-2">+1234567894</td>
                    <td className="p-2">david@example.com</td>
                    <td className="p-2">Paid</td>
                    <td className="p-2">Sent</td>
                    <td className="p-2 flex gap-1">
                        <FontAwesomeIcon icon={faEdit} className="text-black cursor-pointer w-4 h-4"/>
                        <FontAwesomeIcon icon={faTrash} className="text-red-700 cursor-pointer w-4 h-4 ml-4"/>
                    </td>
                </tr>
            </tbody>
        </table>
     </section>
    </>
}