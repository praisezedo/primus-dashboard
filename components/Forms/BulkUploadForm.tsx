"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage , setErrorMessage] = useState<string>('');
  const [uploadProgress , setUploadProgress] = useState<number>(0);
  const [uploading , setUploading] = useState<boolean>(false);
  const [notify , setNotify] = useState<boolean>(true);
  const [message , setMessage] = useState<string>('');
  const [insertedCount , setInsertedCount] = useState<number>(0);

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
      setFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("notify", notify ? "true" : "false");

    setUploading(true);
    setUploadProgress(0);
    try {
      const response = await api.post("/api/students/bulk-upload", formData, {
        onUploadProgress(progressEvent) {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      setMessage(response.data.message);
      setInsertedCount(response.data.inserted || 0);
      toast.success("Upload successful");
      setFile(null);
      setNotify(false);
      setErrorMessage("");
      window.location.reload();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Upload failed";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      router.refresh();
    }
  }
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
            <p className="mt-3 text-sm text-green-600 font-bold">
              Selected: {file.name} 
            </p>  : <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          }
            <div>
             { 
             message && <p className="mt-3 text-sm text-blue-700 font-semibold">{message}</p>
             }
            </div>
            { insertedCount > 0 &&  <div>
              <p className="mt-3 text-sm text-green-700 font-semibold">{insertedCount} students inserted successfully</p>
              </div>}
        </div>
      </div>
          {insertedCount > 0 &&  <Link href="/students" className="flex text-center justify-center mt-3 text-sm text-blue-700 font-semibold hover:underline">View new students</Link>} 
 {uploading && (
      <div className="mx-5 mt-4">
        <div className="h-2 w-full bg-gray-200 rounded">
          <div className="h-2 bg-indigo-600 rounded transition-all" style={{width: `${uploadProgress}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Uploading... {uploadProgress}%
        </p>
      </div>
  )}

<label className="mx-5 mt-4 flex items-center gap-2 text-sm">
    <input 
    type="checkbox" 
    checked={notify}
    onChange={(e) => setNotify(e.target.checked)}
    />
    Notify parents after succesful upload (SMS / Email)
</label>

<button
  onClick={handleUpload}
  disabled={!file || uploading}
  className="mx-5 mt-4 w-275 rounded-lg hover:opacity-50 bg-blue-700 py-3 text-white disabled:opacity-50"
>
  Upload Data
</button>
    </>
  );
}
