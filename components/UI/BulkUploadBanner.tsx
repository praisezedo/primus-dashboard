import Link from "next/link";

export default function BulkUploadBanner() {
    return (
        <>
<div className="mb-6 p-4 border border-yellow-300 mx-5 bg-yellow-50 rounded-lg">
  <h2 className="font-semibold text-yellow-800">
    ⚠️ Before Uploading Students
  </h2>
  <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
    <li>Ensure Fee Types are created.</li>
    <li>Ensure Class Fee Configuration is completed.</li>
    <li>Ensure School Classes & Sections are configured.</li>
  </ul>

  <p className="text-yellow-800 mt-2 font-semibold">
    this can be done in the <Link href="/settings" className="font-bold hover:underline-offset-0 cursor-pointer underline ">Settings Page</Link>
  </p>
</div>
        </>
    );
}