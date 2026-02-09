"use client";

import PrimusLogo from "@/components/UI/PrimusLogo";
import { useRouter } from "next/navigation";


export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <html>
      <body className="flex h-screen items-center justify-center">
        <div className="text-center flex flex-col gap-10 items-center">
          <PrimusLogo/>
          <h2 className="text-2xl font-bold text-red-600">
            Application Error
          </h2>

          <p className="text-gray-500 mt-2">
            Please refresh or contact support.
          </p>

          <button
            onClick={() => {
              reset();
              router.refresh();
            }}
            className="mt-4 rounded hover:opacity-50 bg-blue-700 px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
