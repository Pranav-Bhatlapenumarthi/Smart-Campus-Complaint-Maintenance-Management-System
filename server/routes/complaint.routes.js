import { Router } from "express";
import { registerComplaint, getComplaints, assignComplaint, updateStatus } from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Complaint } from "../models/Complaint.js";

const router = Router();

// Debug endpoint (must be first to avoid being caught by :complaintId)
router.route("/debug/all-complaints").get(async (req, res) => {
    try {
        const allComplaints = await Complaint.find().populate("complaint", "name email").populate("assignedTo", "name email");
        res.status(200).json({
            success: true,
            count: allComplaints.length,
            data: allComplaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Collection routes
router.route("/").post(verifyJWT, upload.single('image'), registerComplaint);
router.route("/").get(verifyJWT, getComplaints);

// Specific routes
router.route("/:complaintId/assign").patch(verifyJWT, assignComplaint);
router.route("/:complaintId/status").patch(verifyJWT, updateStatus);

// Get single complaint by ID (must be last)
router.route("/:complaintId").get(verifyJWT, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.complaintId)
            .populate("complaint", "name email")
            .populate("assignedTo", "name email");
        
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;