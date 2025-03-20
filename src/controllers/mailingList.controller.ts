import { Request, Response } from "express";
import MailingList from "../models/mailingList";


export const createMailingList = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const newEmail = new MailingList({
      email
    });

    const savedEmail = await newEmail.save();
    res.status(201).json(savedEmail);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating email subscription", error });
  }
};

export const getMailingList = async (req: Request, res: Response) => {
  try {
    const list = await MailingList.find();
    res.status(200).json(list);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching mailing list", error });
  }
};

export const getEmailById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mail = await MailingList.findById(req.params.id);
    if (!mail) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    res.status(200).json(mail);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching email", error });
  }
};