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
exports.deleteItem = exports.getItemById = exports.getItems = exports.createBanner = void 0;
const topBanner_model_1 = __importDefault(require("../models/topBanner.model"));
const createBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const newTopBanner = new topBanner_model_1.default({
            name
        });
        const savedItem = yield newTopBanner.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating banner item", error });
    }
});
exports.createBanner = createBanner;
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield topBanner_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
});
exports.getItems = getItems;
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield topBanner_model_1.default.findById(req.params.id);
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json(item);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching item", error });
    }
});
exports.getItemById = getItemById;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedItem = yield topBanner_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
});
exports.deleteItem = deleteItem;
