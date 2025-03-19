import { Request, Response } from "express";
import BannerItem from "../models/topBanner.model";


export const createBanner = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newTopBanner = new BannerItem({
      name
    });

    const savedItem = await newTopBanner.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating banner item", error });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await BannerItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await BannerItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};


export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedItem = await BannerItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};
