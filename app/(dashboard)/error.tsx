"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-10 text-center">
      <h2 className="text-xl font-bold text-red-600">
        Something went wrong
      </h2>

      <p className="text-gray-500 max-w-md">
        An unexpected error occurred while loading this page.
        Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}
