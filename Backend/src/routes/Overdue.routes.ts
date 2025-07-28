import express from "express";
import { getOverdues, sendOverdueEmail } from "../controller/OverdueController";

const router = express.Router();

router.get("/", getOverdues);
router.post("/notify/:readerId", sendOverdueEmail);

export default router;
