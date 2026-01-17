
export default function BulkUploadDirection() {
    return <>
      <section className="m-5 p-5 border border-gray-200 shadow-md rounded-lg">
        <h1 className="font-bold text-2xl">CSV File Format Instructions</h1>
        <div className="flex-col flex gap-3 mb-3">
            <p className="text-gray-500">Please ensure file adheres to the following format. Incorrect formatting may lead to upload errors.</p>
            <p className="text-black">Your CSV file should contain the following headers , exactly as listed below , and in any order:</p>
        </div>
        <ul className="flex flex-col gap-2 mb-5">
            <li><strong>Student Name:</strong> (Text) Full name of the student.</li>
            <li><strong>Student ID:</strong> (Unique Text) A unique identifier for the student.</li>
            <li><strong>Class:</strong> (Text) The class or grade the student belongs to (e.g., "3rd Grade" , "Secondary").</li>
            <li><strong>Section:</strong> (Text) The section or stream of the school (e.g., "A" , "B")</li>
            <li><strong>Parent Name:</strong>(Text) Full name of the primary parent/gaurdian.</li>
            <li><strong>Parent Phone Number:</strong>(Numeric) Contact number of the parent , without spaces or special characters.</li>
            <li><strong>Parent Email:</strong> (Optional Text) Email address of the parent.</li>
            <li><strong>Fees Status:</strong> (Text) Must be either 'Paid' or 'Unpaid'.</li>
        </ul>
        <p><em className="text-red-500">Important:</em> Do not include any extra columns or special characters in the column headers. Ensure data typess match the specifications (e.g., numeric for phone.).</p>
      </section>
    </>
}