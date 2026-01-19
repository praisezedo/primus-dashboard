"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

export default function BulkUploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage , setErrorMessage] = useState<string>('');
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      setErrorMessage("Please upload a CSV file")
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <>
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          cursor-pointer rounded-xl border-2 border-dashed
          mx-5
          p-10 text-center transition
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl"><FontAwesomeIcon icon={faCloudUpload} className={'text-gray-500 w-7 h-7'}/></span>

          <p className="font-medium">
            Drag and drop your CSV file here
          </p>

          <p className="text-sm text-gray-500">
            or click to select a file
          </p>

          {file ? 
            <p className="mt-3 text-sm text-green-600">
              Selected: {file.name} 
            </p>  : <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          }

          {
             
          }
        </div>
      </div>

<button
  disabled={!file}
  className="mx-5 mt-4 w-275 rounded-lg bg-indigo-500 py-3 text-white disabled:opacity-50"
>
  Upload Data
</button>
    </>
  );
}
