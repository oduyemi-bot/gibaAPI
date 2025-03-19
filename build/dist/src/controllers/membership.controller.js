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
exports.deleteMembership = exports.updateMembership = exports.getMembershipById = exports.getMemberships = exports.createMembership = void 0;
const membership_model_1 = __importDefault(require("../models/membership.model"));
const createMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, phone } = req.body;
        const existingMember = yield membership_model_1.default.findOne({ email });
        if (existingMember) {
            res.status(400).json({ message: "Member with this email already exists" });
            return;
        }
        const newMember = new membership_model_1.default({ fullname, email, phone });
        const savedMember = yield newMember.save();
        res.status(201).json(savedMember);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating membership", error });
    }
});
exports.createMembership = createMembership;
const getMemberships = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield membership_model_1.default.find().sort({ fullname: 1 });
        res.status(200).json(members);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching memberships", error });
    }
});
exports.getMemberships = getMemberships;
const getMembershipById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield membership_model_1.default.findById(req.params.id);
        if (!member) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        res.status(200).json(member);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching membership", error });
    }
});
exports.getMembershipById = getMembershipById;
const updateMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMember = yield membership_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedMember) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        res.status(200).json(updatedMember);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating membership", error });
    }
});
exports.updateMembership = updateMembership;
const deleteMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedMember = yield membership_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        res.status(200).json({ message: "Membership deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting membership", error });
    }
});
exports.deleteMembership = deleteMembership;
