"use client";
import { useState } from "react";
import { uploadFile } from "@/lib/api";

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { fileId: string; fileName: string }[]
  >([]);
  const [fileNameDisplay, setFileNameDisplay] = useState("No file selected");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    if (files && files.length > 0) {
      setFileNameDisplay(Array.from(files).map((file) => file.name).join(", "));
    } else {
      setFileNameDisplay("No file selected");
    }
  };
  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    Array.from(selectedFiles).forEach((file) => formData.append("files", file));

    try {
      console.log("Sending files:", selectedFiles);
      console.log("FormData:", formData);
      const res = await uploadFile(formData);

      setMessage({ text: res.message, type: "success" });
      setUploadedFiles((prev) => [...prev, ...res.files]);
      setSelectedFiles(null);
      setFileNameDisplay("No file selected");
      const fileInput = document.getElementById(
        "fileInput"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setTimeout(() => setIsFadingOut(true), 2000);
      setTimeout(() => {
        setUploadedFiles([]);
        setMessage(null);
        setIsFadingOut(false); 
      }, 2000);
    } catch (error: any) {
      setMessage({ text: `${error} Please try again.`, type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-2">Upload CSV</h2>

      <div className="flex items-center mb-4">
        <button
          id="customChooseFileButton"
          className="border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Choose File
        </button>
        <span className="ml-2">{fileNameDisplay}</span>
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          className="hidden" // Hide the default input
        />
      </div>

      <div className="mt-8">
        <button
          onClick={handleUpload}
          disabled={!selectedFiles || isUploading}
          className={`px-4 py-2 rounded-lg text-white ${
            selectedFiles && !isUploading
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
