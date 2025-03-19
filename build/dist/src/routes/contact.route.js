"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const router = express_1.default.Router();
router.post("/", contact_controller_1.createContact);
router.get("/", contact_controller_1.getContacts);
router.get("/:id", contact_controller_1.getContactById);
router.put("/:id/status", contact_controller_1.updateContactStatus);
router.delete("/:id", contact_controller_1.deleteContact);
exports.default = router;
