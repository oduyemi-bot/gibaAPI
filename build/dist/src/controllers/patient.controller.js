"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getPatients = exports.createPatient = void 0;
const patient_model_1 = __importDefault(require("../models/patient.model"));
// Create a new patient
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, phone, age, gender, address, medicalHistory } = req.body;
        // Check if the patient already exists
        const existingPatient = yield patient_model_1.default.findOne({ email });
        if (existingPatient) {
            res.status(400).json({ message: "Patient with this email already exists" });
            return;
        }
        const newPatient = new patient_model_1.default({
            fullname,
            email,
            phone,
            age,
            gender,
            address,
            medicalHistory,
        });
        const savedPatient = yield newPatient.save();
        res.status(201).json(savedPatient);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating patient", error });
    }
});
exports.createPatient = createPatient;
// Get all patients
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patient_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(patients);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching patients", error });
    }
});
exports.getPatients = getPatients;
// Get a single patient by ID
const getPatientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = yield patient_model_1.default.findById(req.params.id);
        if (!patient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }
        res.status(200).json(patient);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching patient", error });
    }
});
exports.getPatientById = getPatientById;
// Update a patient record
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPatient = yield patient_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedPatient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }
        res.status(200).json(updatedPatient);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating patient", error });
    }
});
exports.updatePatient = updatePatient;
// Delete a patient record
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPatient = yield patient_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }
        res.status(200).json({ message: "Patient record deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting patient", error });
    }
});
exports.deletePatient = deletePatient;
