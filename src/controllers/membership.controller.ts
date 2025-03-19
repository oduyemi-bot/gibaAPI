import { Request, Response } from "express";
import Membership from "../models/membership.model";


export const createMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, phone } = req.body;
    const existingMember = await Membership.findOne({ email });
    if (existingMember) {
      res.status(400).json({ message: "Member with this email already exists" });
      return;
    }

    const newMember = new Membership({ fullname, email, phone });
    const savedMember = await newMember.save();

    res.status(201).json(savedMember);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating membership", error });
  }
};

export const getMemberships = async (req: Request, res: Response) => {
  try {
    const members = await Membership.find().sort({ fullname: 1 });
    res.status(200).json(members);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching memberships", error });
  }
};


export const getMembershipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.status(200).json(member);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching membership", error });
  }
};


export const updateMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedMember = await Membership.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMember) {
      res.status(404).json({ message: "Member not found" });
      return
    }

    res.status(200).json(updatedMember);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating membership", error });
  }
};

export const deleteMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedMember = await Membership.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.status(200).json({ message: "Membership deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting membership", error });
  }
};
