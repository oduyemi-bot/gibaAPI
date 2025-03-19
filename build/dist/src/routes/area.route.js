"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const area_controller_1 = require("../controllers/area.controller");
const router = express_1.default.Router();
router.post("/", area_controller_1.createArea);
router.get("/", area_controller_1.getAreas);
router.get("/:id", area_controller_1.getAreaById);
router.delete("/:id", area_controller_1.deleteArea);
exports.default = router;
