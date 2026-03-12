import { Router } from "express";
import { registerComplaint, getComplaints, assignComplaint, updateStatus } from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, registerComplaint);
router.route("/").get(verifyJWT, getComplaints);
router.route("/:complaintId/assign").patch(verifyJWT, assignComplaint);
router.route("/:complaintId/status").patch(verifyJWT, updateStatus);

export default router;