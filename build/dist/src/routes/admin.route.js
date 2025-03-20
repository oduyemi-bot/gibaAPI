"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", admin_controller_1.getAllAdmin);
router.get("/:adminID", admin_controller_1.getAdminById);
router.post("/register", admin_controller_1.registerAdmin);
router.post("/login", admin_controller_1.loginAdmin);
router.put("/:adminID", admin_controller_1.updateAdmin);
router.delete("/:adminID", auth_middleware_1.authenticateAdmin, admin_controller_1.deleteAdmin);
router.put("/reset-password/:adminID", admin_controller_1.resetPassword);
router.post("/logout", auth_middleware_1.authenticateAdmin, admin_controller_1.logoutAdmin);
exports.default = router;
