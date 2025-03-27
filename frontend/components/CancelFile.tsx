"use client";
import { useEffect, useState } from "react";
import { cancelFile } from "@/lib/api";

export default function CancelFile() {
  const [fileId, setFileId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  

  const handleCancel = async () => {
    const trimmedFileId = fileId.trim();

    if (!trimmedFileId) {
      setMessage("Please enter a valid File ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("trimmed file id: ", trimmedFileId);
      const res = await cancelFile(trimmedFileId);
      setMessage(res?.message || "File cancellation requested.");
      setFileId("");
    } catch (error) {
      console.error("Error cancelling file:", error);
      setMessage("Failed to cancel file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-2">Cancel File Processing</h2>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          placeholder="Enter File ID"
          className="border p-2 rounded-lg flex-grow"
        />
        <button
          type="button"
          onClick={handleCancel}
          disabled={!fileId.trim() || loading}
          className={`px-4 py-2 rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-400"
          }`}
        >
          {loading ? "Cancelling..." : "Cancel"}
        </button>
      </div>

      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}
