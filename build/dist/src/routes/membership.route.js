"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const membership_controller_1 = require("../controllers/membership.controller");
const router = express_1.default.Router();
router.post("/", membership_controller_1.createMembership);
router.get("/", membership_controller_1.getMemberships);
router.get("/:id", membership_controller_1.getMembershipById);
router.put("/:id", membership_controller_1.updateMembership);
router.delete("/:id", membership_controller_1.deleteMembership);
exports.default = router;
