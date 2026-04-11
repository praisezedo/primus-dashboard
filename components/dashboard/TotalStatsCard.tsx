"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../UI/LoadingSpinner";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function TotalStatsCard ({
    loadingState,
    totalStudents,
}: { loadingState: boolean ,totalStudents: number}) {
  return (
    <div className="px-4 lg:px-5 w-full max-w-sm h-32 lg:h-40 mb-6 lg:mb-10 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-2 lg:gap-3">
        {loadingState ? <LoadingSpinner/> :
         <>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm lg:text-base">Total Students</p>
            <span className="p-1.5 lg:p-2 rounded-full bg-blue-100">
                <FontAwesomeIcon icon={faUsers}className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700"/>
            </span>
          </div>

          <h1 className="font-bold text-2xl lg:text-3xl">
            {totalStudents.toLocaleString()}
          </h1>

          <p className="text-gray-500 text-xs lg:text-sm">
            Total number of students enrolled in this session
          </p>
         </>}
    </div>
  )
}