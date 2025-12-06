import express from "express";
import { savePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", savePayment);

export default router;
