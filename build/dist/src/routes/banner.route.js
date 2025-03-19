"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topBanner_controller_1 = require("../controllers/topBanner.controller");
const router = express_1.default.Router();
router.post("/", topBanner_controller_1.createBanner);
router.get("/", topBanner_controller_1.getItems);
router.get("/:id", topBanner_controller_1.getItemById);
router.delete("/:id", topBanner_controller_1.deleteItem);
exports.default = router;
