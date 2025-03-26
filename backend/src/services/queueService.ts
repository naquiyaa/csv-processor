import { FileStatus } from "../utils/constants";
import { failedJobs, processCSV } from "../services/csvProcessor";

export interface FileJob {
  id: string;
  fileName: string;
  buffer: Buffer;
  status: FileStatus;
  result?: Record<string, Record<number, number>>; // { "State": { "Year": count } }
  error?: string;
}

export const queue: FileJob[] = [];

//add file to queue
export const addFileToQueue = (
  id: string,
  fileName: string,
  buffer: Buffer
) => {
  queue.push({ id, fileName, buffer, status: FileStatus.QUEUED });
};

//fetch entire queue status
export const getQueueStatus = () => {
  console.log("Current Queue Status:");
  queue.forEach(({ id, fileName, status }) => {
    console.log(`ID: ${id}, File: ${fileName}, Status: ${status}`);
  });

  return queue.map(({ id, fileName, status, result, error }) => ({
    id,
    fileName,
    status,
    result,
    error,
  }));
};

export const startQueueProcessor = () => {
  setInterval(async () => {
    const job = queue.find((file) => file.status === FileStatus.QUEUED);
    if (!job) return;

    job.status = FileStatus.PROCESSING as FileStatus;
    //Add a 5-second delay before starting processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      job.result = await processCSV(job.id, job.buffer);
      if (job.status !== FileStatus.CANCELLED) {
        job.status = FileStatus.COMPLETED;
      }
    } catch (error) {
      if (job.status !== FileStatus.CANCELLED) {
        job.status = FileStatus.FAILED;
        job.error = (error as Error).message;
      }
    }
  }, 30000);
};

