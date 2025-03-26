import csvParser = require("csv-parser");
import { Readable } from "stream";

interface ProcessedData {
  [state: string]: {
    [year: number]: number;
  };
}

export const activeJobs = new Map<string, AbortController>();
export const failedJobs = new Map<string, string>();

export const processCSV = async (fileId: string, buffer: Buffer): Promise<ProcessedData> => {
  console.log(`Starting to process CSV for file ${fileId}...`);

  const results: ProcessedData = {};
  const controller = new AbortController();
  activeJobs.set(fileId, controller);
  failedJobs.delete(fileId);

  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer.toString()).pipe(csvParser());

    let hasValidData = false;
    let headerChecked = false;
    let missingHeaders = false;

    stream.on("headers", (headers) => {
      // Validate headers before processing any rows
      const requiredHeaders = [
        "Provider Business Practice Location Address State Name",
        "Provider Enumeration Date",
        "NPI"
      ];

      const missing = requiredHeaders.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        console.error(`Missing required headers: ${missing.join(", ")}`);
        const errorMessage = `Invalid CSV format. Missing headers: ${missing.join(", ")}`;
        missingHeaders = true;
        failedJobs.set(fileId, errorMessage);
        stream.destroy(); // Stop processing
        return reject(new Error(`Invalid CSV format. Missing headers: ${missing.join(", ")}`));
      }

      headerChecked = true;
    });

    stream.on("data", (row) => {
      if (!headerChecked || missingHeaders) return;
      if (controller.signal.aborted) {
        console.log(`Processing aborted for file ${fileId}`);
        const errorMessage = `Processing aborted for file ${fileId}`;
        
        stream.destroy();
        failedJobs.set(fileId, errorMessage);
        reject(new Error("Processing aborted"));
        return;
      }

      try {
        const state = row["Provider Business Practice Location Address State Name"];
        const dateStr = row["Provider Enumeration Date"];
        const npi = row["NPI"];

        if (!state || !dateStr || !npi) return;
        const year = new Date(dateStr).getFullYear();
        if (isNaN(year)) return;

        if (!results[state]) {
          results[state] = {};
        }

        results[state][year] = (results[state][year] || 0) + 1;
        hasValidData = true;
      } catch (error) {
        console.error("Error processing row:", error);
      }
    });

    stream.on("end", () => {
      if (!hasValidData) {
        const errorMessage = "CSV processing completed but no valid data found";
        failedJobs.set(fileId, errorMessage);
        
        reject(new Error("CSV processing completed but no valid data found"));
        return;
      }
      console.log(`Finished processing CSV for file ${fileId}`);

      resolve(results);
      activeJobs.delete(fileId);
    });

    stream.on("error", (error) => {
      console.error(`Error processing CSV for file ${fileId}:`, error);
      reject(error);
      activeJobs.delete(fileId);
    });
  });
};