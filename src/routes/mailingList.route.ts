import express from "express";
import { createMailingList, getEmailById, getMailingList } from "../controllers/mailingList.controller";

const router = express.Router();

router.post("/", createMailingList);
router.get("/", getMailingList);
router.get("/:id", getEmailById);

export default router;
