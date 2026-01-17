import {useRef , useState} from 'react';

export default function StudentDataForm() {
    const [notify , setNotify] = useState<boolean>(true);

    const setNotification = () => {
        setNotify(!notify)
    }
return <>
<form action="">
<div className="grid grid-cols-3 p-5">
    <div className="flex flex-col gap-2">
    <label className="font-bold" htmlFor="student-name">Student Name</label> 
    <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="text" name="student-name" id="student-name" placeholder="Enter students full name" />
    </div>

    <div className="flex flex-col gap-2">
    <label className="font-bold" htmlFor="student-id">Student ID</label> 
    <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="text" name="student-id" id="student-id" placeholder="e.g. STU012 " />
    </div>

    <div className="flex flex-col gap-2">
    <label className="font-bold" htmlFor="class">Class</label> 
    <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="text" name="class" id="class" placeholder="e.g., 5th Grade" />
    </div>

    <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="section">Section</label>
        <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="text" name="section" id="section" placeholder="e.g., A" />
    </div>

    <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="parent-name">Parent Name</label>
        <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="text" name="parent-name" id="parent-name" placeholder="Enter parent's full name" />
    </div>

    <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="parent-phone">Parent Phone Number</label>
        <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="text" name="parent-phone" id="parent-phone" placeholder="e.g., +1234567890" />
    </div>

    <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="parent-email">Parent Email (Optional)</label>
        <input className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" type="email" name="parent-email" id="parent-email" placeholder="e.g., parent@example.com" />
    </div>

    <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="fees-status">Fees Status</label>
        <select className="rounded-md focus:outline-none focus:border-gray-200 w-80 border border-gray-200 p-3" name="fees-status" id="fees-status">
            <option value="">Select Fees Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
        </select>
    </div>

    <div className="flex gap-5 items-center mt-7">
        <label className="font-bold" htmlFor="send-sms">Notify Parents</label>
        <input type="checkbox" name="send-sms" id="send-sms" checked={notify} onChange={setNotification} />
    </div>
</div>
</form>
</>
}