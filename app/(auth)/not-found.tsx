import PrimusLogo from "@/components/UI/PrimusLogo";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-[70vh] flex-col items-center justify-center gap-10 text-center">
            <PrimusLogo/>
           <h1 className="text-4xl font-bold text-gray-800">404</h1>
           <p>This dashboard page does not exist.</p>
           <Link 
            href="/"
        className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:opacity-90"
           >Back to Dashboard</Link>
        </div>
    );
}