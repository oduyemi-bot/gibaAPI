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
exports.deleteContact = exports.updateContactStatus = exports.getContactById = exports.getContacts = exports.createContact = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
// Create a new contact entry
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, phone, subject, message } = req.body;
        const newContact = new contact_model_1.default({
            fullname,
            email,
            phone,
            subject,
            message,
        });
        const savedContact = yield newContact.save();
        res.status(201).json(savedContact);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating contact", error });
    }
});
exports.createContact = createContact;
// Get all contact entries
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching contacts", error });
    }
});
exports.getContacts = getContacts;
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield contact_model_1.default.findById(req.params.id);
        if (!contact) {
            res.status(404).json({ message: "Contact not found" });
            return;
        }
        res.status(200).json(contact);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching contact", error });
    }
});
exports.getContactById = getContactById;
// Update contact status
const updateContactStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!["pending", "working", "resolved", "rejected"].includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        const updatedContact = yield contact_model_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updatedContact) {
            res.status(404).json({ message: "Contact not found" });
            return;
        }
        res.status(200).json(updatedContact);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating contact status", error });
    }
});
exports.updateContactStatus = updateContactStatus;
// Delete a contact
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedContact = yield contact_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            res.status(404).json({ message: "Contact not found" });
            return;
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting contact", error });
    }
});
exports.deleteContact = deleteContact;
