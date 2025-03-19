import { Request, Response } from "express";
import Contact from "../models/contact.model";

// Create a new contact entry
export const createContact = async (req: Request, res: Response) => {
  try {
    const { fullname, email, phone, subject, message } = req.body;

    const newContact = new Contact({
      fullname,
      email,
      phone,
      subject,
      message,
    });

    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: "Error creating contact", error });
  }
};

// Get all contact entries
export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};


export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact", error });
  }
};

// Update contact status
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!["pending", "working", "resolved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      res.status(404).json({ message: "Contact not found" });
      return
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact status", error });
  }
};

// Delete a contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      res.status(404).json({ message: "Contact not found" });
      return
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
};
