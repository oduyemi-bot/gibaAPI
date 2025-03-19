import { Request, Response } from "express";
import Patient from "../models/patient.model";

// Create a new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, phone, age, gender, address, medicalHistory } = req.body;

    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      res.status(400).json({ message: "Patient with this email already exists" });
      return;
    }

    const newPatient = new Patient({
      fullname,
      email,
      phone,
      age,
      gender,
      address,
      medicalHistory,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error creating patient", error });
  }
};

// Get all patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

// Get a single patient by ID
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error });
  }
};

// Update a patient record
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error });
  }
};

// Delete a patient record
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.status(200).json({ message: "Patient record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error });
  }
};
