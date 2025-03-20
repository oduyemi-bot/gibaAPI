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
exports.logoutAdmin = exports.resetPassword = exports.deleteAdmin = exports.updateAdmin = exports.loginAdmin = exports.registerAdmin = exports.getAdminById = exports.getAllAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
dotenv_1.default.config();
const getAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administrators = yield admin_model_1.default.find().select("-password");
        res.status(200).json(administrators);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving administrators", error: error.message });
    }
});
exports.getAllAdmin = getAllAdmin;
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminID = req.params.adminID;
        const admin = yield admin_model_1.default.findById(adminID).select("-password");
        if (!admin) {
            res.status(404).json({ Message: "Admin not found" });
        }
        else {
            res.json({ data: admin });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});
exports.getAdminById = getAdminById;
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, jobrole, password, confirmPassword } = req.body;
        if (![fname, lname, email, phone, jobrole, password, confirmPassword].every((field) => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ message: "Both passwords must match!" });
            return;
        }
        const existingAdmin = yield admin_model_1.default.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: "Email is already registered" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newAdmin = new admin_model_1.default({ fname, lname, email, phone, jobrole, password: hashedPassword });
        yield newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ adminID: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const adminSession = {
            adminID: newAdmin._id,
            fname: newAdmin.fname,
            lname: newAdmin.lname,
            email: newAdmin.email,
            phone: newAdmin.phone,
            jobrole: newAdmin.jobrole,
            createdAt: newAdmin.createdAt,
            updatedAt: newAdmin.updatedAt,
        };
        req.session.admin = adminSession;
        res.status(201).json({
            message: "Admin registered successfully.",
            token,
            admin: {
                AdminID: newAdmin._id,
                fname: newAdmin.fname,
                lname: newAdmin.lname,
                email: newAdmin.email,
                phone: newAdmin.phone,
                jobrole: newAdmin.jobrole,
            },
            nextStep: "/next-login-page",
        });
    }
    catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({ message: "Error registering admin" });
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const admin = yield admin_model_1.default.findOne({ email });
        if (!admin) {
            res.status(401).json({ message: "Email not registered. Please register first." });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const payload = { adminID: admin._id };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        const adminSession = {
            adminID: admin._id,
            fname: admin.fname,
            lname: admin.lname,
            email: admin.email,
            phone: admin.phone,
            jobrole: admin.jobrole,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        };
        req.session.admin = adminSession;
        res.status(200).json({
            message: "success",
            adminID: admin._id,
            fname: admin.fname,
            lname: admin.lname,
            email: admin.email,
            phone: admin.phone,
            jobrole: admin.jobrole,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            nextStep: "/next-dashboard",
            token,
        });
    }
    catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Error logging in admin" });
    }
});
exports.loginAdmin = loginAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(adminID)) {
            res.status(400).json({ message: "Invalid admin ID" });
            return;
        }
        const updatedAdminData = req.body;
        const requiredFields = ["fname", "lname", "email", "phone"];
        const missingFields = requiredFields.filter((field) => field in updatedAdminData && !updatedAdminData[field]);
        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            return;
        }
        if (updatedAdminData.password) {
            updatedAdminData.password = yield bcrypt_1.default.hash(updatedAdminData.password, 10);
        }
        const updatedAdmin = yield admin_model_1.default.findByIdAndUpdate(adminID, updatedAdminData, { new: true });
        if (!updatedAdmin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.status(200).json({ data: updatedAdmin, message: "Admin profile updated successfully" });
    }
    catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminID = req.params.adminID;
        if (!req.session.admin || req.session.admin.adminID.toString() !== adminID) {
            res.status(401).json({ message: "Unauthorized: Admin not logged in or unauthorized to perform this action" });
            return;
        }
        const admin = yield admin_model_1.default.findById(adminID);
        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        yield admin_model_1.default.findByIdAndDelete(adminID);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "Admin account deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting admin account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteAdmin = deleteAdmin;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminID = req.params.adminID;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            res.status(400).json({ message: "All fields are required: oldPassword, newPassword, confirmNewPassword" });
            return;
        }
        const admin = yield admin_model_1.default.findById(adminID);
        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        if (!admin.password) {
            res.status(400).json({ message: "Admin has no password set. Cannot reset." });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            res.status(400).json({ message: "Both passwords must match!" });
            return;
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(oldPassword, admin.password);
        if (!isPasswordMatch) {
            res.status(400).json({ message: "Incorrect old password" });
            return;
        }
        admin.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield admin.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting admin password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.resetPassword = resetPassword;
const logoutAdmin = (req, res) => {
    const adminID = req.params.adminID;
    try {
        if (!req.session.admin || req.session.admin.adminID.toString() !== adminID) {
            res.status(401).json({ message: "Unauthorized: Admin not logged in or unauthorized to perform this action" });
            return;
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Error logging out" });
            }
            res.status(200).json({ message: "Admin logged out successfully" });
        });
    }
    catch (error) {
        console.error("Error during admin logout:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.logoutAdmin = logoutAdmin;
