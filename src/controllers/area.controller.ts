import { Request, Response } from "express";
import ServiceArea from "../models/serviceArea.model";


export const createArea = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newArea = new ServiceArea({
      name
    });

    const savedItem = await newArea.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating area", error });
  }
};

export const getAreas = async (req: Request, res: Response) => {
  try {
    const areas = await ServiceArea.find().sort({ createdAt: -1 });
    res.status(200).json(areas);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching areas", error });
  }
};

export const getAreaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const area = await ServiceArea.findById(req.params.id);
    if (!area) {
      res.status(404).json({ message: "Area not found" });
      return;
    }
    res.status(200).json(area);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching area", error });
  }
};

export const deleteArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedArea = await ServiceArea.findByIdAndDelete(req.params.id);
    if (!deletedArea) {
      res.status(404).json({ message: "Area not found" });
      return;
    }
    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting area", error });
  }
};
