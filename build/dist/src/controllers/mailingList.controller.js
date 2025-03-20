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
exports.getEmailById = exports.getMailingList = exports.createMailingList = void 0;
const mailingList_1 = __importDefault(require("../models/mailingList"));
const createMailingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const newEmail = new mailingList_1.default({
            email
        });
        const savedEmail = yield newEmail.save();
        res.status(201).json(savedEmail);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating email subscription", error });
    }
});
exports.createMailingList = createMailingList;
const getMailingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield mailingList_1.default.find();
        res.status(200).json(list);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching mailing list", error });
    }
});
exports.getMailingList = getMailingList;
const getEmailById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = yield mailingList_1.default.findById(req.params.id);
        if (!mail) {
            res.status(404).json({ message: "Email not found" });
            return;
        }
        res.status(200).json(mail);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching email", error });
    }
});
exports.getEmailById = getEmailById;
