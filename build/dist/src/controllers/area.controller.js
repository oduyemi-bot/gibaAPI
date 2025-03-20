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
exports.deleteArea = exports.updateArea = exports.getAreaById = exports.getAreas = exports.createArea = void 0;
const serviceArea_model_1 = __importDefault(require("../models/serviceArea.model"));
const createArea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const newArea = new serviceArea_model_1.default({
            name
        });
        const savedItem = yield newArea.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating area", error });
    }
});
exports.createArea = createArea;
const getAreas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areas = yield serviceArea_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(areas);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching areas", error });
    }
});
exports.getAreas = getAreas;
const getAreaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const area = yield serviceArea_model_1.default.findById(req.params.id);
        if (!area) {
            res.status(404).json({ message: "Area not found" });
            return;
        }
        res.status(200).json(area);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching area", error });
    }
});
exports.getAreaById = getAreaById;
const updateArea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedArea = yield serviceArea_model_1.default.findByIdAndUpdate(req.params._id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedArea) {
            res.status(404).json({ message: "Area not found" });
            return;
        }
        res.status(200).json(updatedArea);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating area", error });
    }
});
exports.updateArea = updateArea;
const deleteArea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedArea = yield serviceArea_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedArea) {
            res.status(404).json({ message: "Area not found" });
            return;
        }
        res.status(200).json({ message: "Area deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting area", error });
    }
});
exports.deleteArea = deleteArea;
