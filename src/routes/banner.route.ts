import express from "express";
import {
  createBanner,
  getItems,
  getItemById,
  deleteItem,
} from "../controllers/topBanner.controller";

const router = express.Router();

router.post("/", createBanner);
router.get("/", getItems);
router.get("/:id", getItemById);
router.delete("/:id", deleteItem);

export default router;
