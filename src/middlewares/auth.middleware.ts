import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin, { IAdmin } from "../models/admin.model";

dotenv.config();

interface AuthenticatedRequest extends Request {
    admin?: IAdmin; 
}

export const authenticateAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.session.admin) {
            res.status(401).json({ message: "Unauthorized. No admin session found." });
            return;
        }

        const adminID = req.session.admin.adminID;
        if (!adminID || !mongoose.Types.ObjectId.isValid(adminID.toString())) {
            res.status(400).json({ message: "Invalid admin ID format." });
            return;
        }

        const admin = await Admin.findById(adminID);
        if (!admin) {
            res.status(404).json({ message: "Admin not found." });
            return;
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error("Error during admin authentication:", error);
        res.status(500).json({ message: "Internal server error during authentication." });
    }
};