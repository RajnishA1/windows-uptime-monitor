import express from "express";
import { createSystemLog, getSystemLogs } from "../controller/systemLog.controller.js";

const router = express.Router();

router.post("/createSystemLog", createSystemLog);
router.get("/getSystemLog", getSystemLogs);

export default router;
