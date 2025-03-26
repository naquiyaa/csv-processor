import { Request, Response } from "express";
import createError = require("http-errors");
import multer = require("multer");
import { v4 as uuidv4 } from "uuid";
import {
  addFileToQueue,
  getQueueStatus,
} from "../services/queueService";
import { cancelFileProcessing, getFailureReason, getFileStatus } from "../services/fileService";

// Multer configuration (memory storage)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadFile = async (req: Request, res: Response) => {
  try {
    console.log("Received files:", req.files);

    //throw error if no file given
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw createError.BadRequest("No file uploaded.");
    }

    const filesProcessed = [];

    for (const file of req.files as Express.Multer.File[]) {
      //generate meta data for each file
      const fileId = uuidv4();
      const fileName = file.originalname;
      const fileBuffer = file.buffer;

      //validate csv format
      if (!fileName.toLowerCase().endsWith(".csv") || file.mimetype !== "text/csv") {
        throw createError.BadRequest(`File "${fileName}" is not a valid CSV file.`);
      }

      //if file empty throw error
      if (!fileBuffer || fileBuffer.length === 0) {
        throw createError(400, `File "${fileName}" is empty.`);
      }

      //add teh fiel to queue for processing
      addFileToQueue(fileId, fileName, fileBuffer);
      filesProcessed.push({ fileId, fileName });
    }

    res.status(202).json({
      message: "Files queued for processing",
      files: filesProcessed,
    });
  } catch (error: any) {
    console.error("An error occurred: ", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

//get the status of the overall queue
export const getQueueStatusController = (req: Request, res: Response) => {
  try {
    const status = getQueueStatus();
    res.json(status);
  } catch (error: any) {
    console.error("An error occurred: ", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
export const getFileStatusController = (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      throw createError.BadRequest("File ID is required.");
    }

    const fileStatus = getFileStatus(fileId);
    const failureReason = getFailureReason(fileId);
    if (!fileStatus) {
      throw createError.BadRequest("File not found.");
    }

    res.json({
      message: "File Status fetched successfully",
      fileStatus,
      failureReason: failureReason || null,
    });
  } catch (error) {
    console.error("Error fetching file status:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const cancelFileController = (req: Request, res: Response) => {
    try {
      const { fileId } = req.params;
      if (!fileId) {
        throw createError.BadRequest("File ID is required.");
      }
  
      const success = cancelFileProcessing(fileId);
      if (!success) {
        throw createError.NotFound("File not found or cannot be canceled.");
      }
  
      res.json({ message: "File processing canceled successfully." });
    } catch (error) {
      console.error("Error canceling file processing:", error);
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error. Please try again later.",
      });
    }
  };
