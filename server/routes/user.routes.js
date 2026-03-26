import { Router } from "express";
import { getTechnicians, getUserById, getAllUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - get all technicians
router.route("/technicians").get(getTechnicians);

// Protected routes
router.route("/:userId").get(verifyJWT, getUserById);
router.route("/").get(verifyJWT, getAllUsers);

export default router;
