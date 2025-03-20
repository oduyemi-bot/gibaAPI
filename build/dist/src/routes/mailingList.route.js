"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mailingList_controller_1 = require("../controllers/mailingList.controller");
const router = express_1.default.Router();
router.post("/", mailingList_controller_1.createMailingList);
router.get("/", mailingList_controller_1.getMailingList);
router.get("/:id", mailingList_controller_1.getEmailById);
exports.default = router;
