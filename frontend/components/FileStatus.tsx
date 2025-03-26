"use client";
import { useState } from "react";
import { getFileStatus } from "@/lib/api";

type FileStatusResponse = {
  message: string;
  fileStatus: {
    id: string;
    fileName: string;
    status: string;
    result: Record<string, Record<string, number>>; // Nested object structure
  };
  failureReason?: string;
};

export default function FileStatus() {
  const [fileId, setFileId] = useState("");
  const [status, setStatus] = useState<FileStatusResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!fileId.trim()) {
      setError("Please enter a valid File ID.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus(null);

    try {
      const res: FileStatusResponse = await getFileStatus(fileId);

      if (!res.fileStatus) {
        throw new Error("File not found.");
      }

      setStatus(res);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching file status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Check File Status</h2>

      {/* Input & Button */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          placeholder="Enter File ID"
          className="border p-2 rounded-lg flex-grow"
        />
        <button
          onClick={checkStatus}
          disabled={!fileId.trim() || loading}
          className={`px-4 py-2 rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* File Status Display */}
      {status && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">File Details</h3>
          <p>
            <strong>File Name:</strong> {status.fileStatus.fileName}
          </p>
          <p
            className={`font-semibold ${
              status.fileStatus.status === "FAILED" ? "text-red-600" : "text-green-600"
            }`}
          >
            <strong>Status:</strong> {status.fileStatus.status}
          </p>

          {/* Show Failure Reason if File Failed */}
          {status.fileStatus.status === "FAILED" && status.failureReason && (
            <p className="text-red-500">
              <strong>Failure Reason:</strong> {status.failureReason}
            </p>
          )}

          {/* Tooltip for Data Explanation */}
          {status.fileStatus.status !== "FAILED" && (
            <>
              <div className="relative flex items-center mt-4">
                <h4 className="font-semibold">Result Breakdown</h4>
                <span className="ml-2 text-gray-500 cursor-pointer group">
                  ℹ
                  <span className="absolute left-0 bottom-full mb-1 w-56 text-xs text-white bg-gray-700 p-2 rounded hidden group-hover:block">
                    This table shows the total number of NPIs (National Provider Identifiers) enumerated in each state per year.
                  </span>
                </span>
              </div>

              {/* Table View for Clear Data Representation */}
              <div className="max-h-60 overflow-y-auto border p-2 rounded-lg bg-white mt-2">
                {status.fileStatus.result &&
                Object.keys(status.fileStatus.result).length > 0 ? (
                  <table className="w-full border mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">State</th>
                        <th className="p-2 border">Year</th>
                        <th className="p-2 border">Total Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(status.fileStatus.result).map(([state, years]) =>
                        Object.entries(years).map(([year, count]) => (
                          <tr key={`${state}-${year}`} className="border">
                            <td className="p-2 border">{state}</td>
                            <td className="p-2 border">{year}</td>
                            <td className="p-2 border">{count}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No Data Available</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
