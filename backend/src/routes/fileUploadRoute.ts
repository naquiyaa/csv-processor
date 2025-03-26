import express = require("express");
import { cancelFileController, getFileStatusController, getQueueStatusController, uploadFile } from "../controllers/fileUploadController";
import multer = require("multer");

//store files in memory-buffer
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const router = express.Router();

//multer parses the form data and then stores the uploaded files in memory (req.files)
router.post("/upload", upload.array("files"), uploadFile);
router.get("/status", getQueueStatusController);
router.get("/status/:fileId", getFileStatusController);
router.delete("/cancel/:fileId", cancelFileController);


export default router;
