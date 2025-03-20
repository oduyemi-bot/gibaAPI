import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv"
import Admin, { IAdmin } from "../models/admin.model";

dotenv.config()

interface AdminSession {
    adminID: mongoose.Types.ObjectId;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    jobrole: string;
    createdAt: Date;
    updatedAt?: Date;
}

declare module "express-session" {
    interface SessionData {
        admin?: AdminSession;
    }
}

export {};


export const getAllAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const administrators: IAdmin[] = await Admin.find().select("-password");
        res.status(200).json(administrators);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving administrators", error: error.message });
    }
};


export const getAdminById = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminID = req.params.adminID;
        const admin: IAdmin | null = await Admin.findById(adminID).select("-password");
    
        if (!admin) {
        res.status(404).json({ Message: "Admin not found" });
        } else {
        res.json({ data: admin });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
};


export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
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

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: "Email is already registered" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin: IAdmin = new Admin({ fname, lname, email, phone, jobrole, password: hashedPassword }) as IAdmin;
        await newAdmin.save();

        const token = jwt.sign(
            { adminID: newAdmin._id, email: newAdmin.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

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
    } catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({ message: "Error registering admin" });
    }
};


export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return; 
        }

        const admin: IAdmin | null = await Admin.findOne({ email });
        
        if (!admin) {
            res.status(401).json({ message: "Email not registered. Please register first." });
            return; 
        }

        const isMatch = await bcrypt.compare(password, admin.password);
  
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
  
        const payload = { adminID: admin._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

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
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Error logging in admin" });
    }
};




export const updateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { adminID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(adminID)) {
            res.status(400).json({ message: "Invalid admin ID" });
            return;
        }

        const updatedAdminData: Partial<IAdmin> = req.body;
        const requiredFields: Array<keyof IAdmin> = ["fname", "lname", "email", "phone"];
        const missingFields = requiredFields.filter(
            (field) => field in updatedAdminData && !updatedAdminData[field]
        );

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            return; 
        }

        if (updatedAdminData.password) {
            updatedAdminData.password = await bcrypt.hash(updatedAdminData.password, 10);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(adminID, updatedAdminData, { new: true });

        if (!updatedAdmin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }

        res.status(200).json({ data: updatedAdmin, message: "Admin profile updated successfully" });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminID = req.params.adminID;
        if (!req.session.admin || req.session.admin.adminID.toString() !== adminID) {
            res.status(401).json({ message: "Unauthorized: Admin not logged in or unauthorized to perform this action" });
            return; 
        }
        const admin = await Admin.findById(adminID);
        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return; 
        }

        await Admin.findByIdAndDelete(adminID);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "Admin account deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminID = req.params.adminID;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            res.status(400).json({ message: "All fields are required: oldPassword, newPassword, confirmNewPassword" });
            return;
        }

        const admin = await Admin.findById(adminID);
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

        const isPasswordMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isPasswordMatch) {
            res.status(400).json({ message: "Incorrect old password" });
            return;
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting admin password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const logoutAdmin = (req: Request, res: Response) => {
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
    } catch (error) {
        console.error("Error during admin logout:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};