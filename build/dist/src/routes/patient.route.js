"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controller_1 = require("../controllers/patient.controller");
const router = express_1.default.Router();
router.post("/", patient_controller_1.createPatient);
router.get("/", patient_controller_1.getPatients);
router.get("/:id", patient_controller_1.getPatientById);
router.put("/:id", patient_controller_1.updatePatient);
router.delete("/:id", patient_controller_1.deletePatient);
exports.default = router;
