import express from "express";
import {
  createProperty,
  getProperties,
  getSingleProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.post("/", createProperty);
router.get("/", getProperties);
router.get("/:id", getSingleProperty);

export default router;
