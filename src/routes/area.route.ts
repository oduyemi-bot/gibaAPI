import express from "express";
import {
  createArea,
  getAreas,
  getAreaById,
  deleteArea,
} from "../controllers/area.controller";

const router = express.Router();

router.post("/", createArea);
router.get("/", getAreas);
router.get("/:id", getAreaById);
router.delete("/:id", deleteArea);

export default router;
