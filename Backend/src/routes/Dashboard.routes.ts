import express from "express";
import { getDashboardStats } from "../controller/DashboardController";

const router = express.Router();

router.get("/", getDashboardStats);

export default router;
