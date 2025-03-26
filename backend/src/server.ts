import express = require("express");
import dotenv = require("dotenv");
import fileUploadRouter from "./routes/fileUploadRoute";
import { startQueueProcessor } from "../src/services/queueService";
import { Request, Response } from "express";

dotenv.config();
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", fileUploadRouter);
app.get("/custom-healthcheck", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//start processing the queue
startQueueProcessor();
