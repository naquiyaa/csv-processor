import { FileStatus } from "../utils/constants";
import { failedJobs, processCSV } from "../services/csvProcessor";
import { FileJob, queue } from "./queueService";

export const cancelFileProcessing = (fileId: string): boolean => {
    const job = queue.find((file) => file.id === fileId);
    //cannot cancel a job if it does not exist + can't cancel it if status is failed or already completed
    if (
      !job ||
      job.status === FileStatus.COMPLETED ||
      job.status === FileStatus.FAILED
    ) {
      return false;
    }
  
    console.log(`Cancelling job: ${fileId}`);
    job.status = FileStatus.CANCELLED;
    return true;
  };
  export const getFileStatus = (
    fileId: string
  ): (Omit<FileJob, "buffer"> & { failureReason?: string }) | null => {
    const job = queue.find((file) => file.id === fileId);
  
    if (!job) return null;
  
    if (failedJobs.has(fileId)) {
      return {
        ...job,
        failureReason: failedJobs.get(fileId),
        status: FileStatus.FAILED,
      };
    }
  
    const { buffer, ...jobWithoutBuffer } = job;
    return jobWithoutBuffer;
  };
  export const getFailureReason = (fileId: string): string | null => {
    return failedJobs.get(fileId) || null;
  };