import { Request, Response } from "express";
import BannerItem from "../models/topBanner.model";


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
    const item = await BannerItem.findById(req.params._id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};


export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedItem = await BannerItem.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedItem) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
  
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating item", error });
    }
  };



export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedItem = await BannerItem.findByIdAndDelete(req.params._id);
    if (!deletedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};
