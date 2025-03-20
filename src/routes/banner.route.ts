import express from "express";
import {
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/topBanner.controller";

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
