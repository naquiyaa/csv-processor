"use client";
import { useEffect, useState } from "react";
import { getQueueStatus } from "@/lib/api";

// Define the type for queue items
type QueueItem = {
  id: string;
  fileName: string;
  status: string;
  result?: Record<string, Record<string, number>>; // Optional because not all items have it
};

export default function QueueStatus() {
  const [queue, setQueue] = useState<QueueItem[]>([]); 

  useEffect(() => {
    const fetchStatus = async () => {
      const res: QueueItem[] = await getQueueStatus();
      setQueue(res);
    };
    fetchStatus();
    // Set interval to fetch every 3 seconds
    const intervalId = setInterval(fetchStatus, 3000);

    // Cleanup interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-2">Uploaded Files</h2>

      <div className="max-h-60 overflow-y-auto border rounded-md p-2">
        {queue.length === 0 ? (
          <p>No files in the queue.</p>
        ) : (
          <ul>
            {queue.map((file) => (
              <li key={file.id} className="border-b py-2">
                <span className="font-semibold">{file.fileName}</span> -{" "}
                <span className="text-gray-700">{file.status}</span> -{" "}
                <span className="font-mono">{file.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
