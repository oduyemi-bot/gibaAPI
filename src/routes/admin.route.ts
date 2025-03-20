import express from "express";
import { 
    getAllAdmin,
    getAdminById,
    registerAdmin, 
    loginAdmin, 
    updateAdmin, 
    deleteAdmin, 
    resetPassword, 
    logoutAdmin 
} from "../controllers/admin.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware"; 

const router = express.Router();

router.get("/", getAllAdmin);
router.get("/:adminID", getAdminById);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/:adminID", updateAdmin);
router.delete("/:adminID", authenticateAdmin, deleteAdmin);
router.put("/reset-password/:adminID", resetPassword);
router.post("/logout", authenticateAdmin, logoutAdmin);

export default router;