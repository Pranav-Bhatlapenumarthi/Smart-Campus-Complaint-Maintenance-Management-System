import { Complaint } from "../models/complaint.model.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// 1. Register Complaint (Student/Faculty)
const registerComplaint = asyncHandler(async (req, res) => {
    const { title, description, category, location, priority } = req.body;

    if ([title, description, category, location].some((field) => field?.trim() === "")) {
        throw new APIError(400, "All fields are required");
    }

    // Handle Image Upload
    let imageLocalPath;
    if (req.file) {
        imageLocalPath = req.file.path;
        // Note: In production, you would upload this 'imageLocalPath' to Cloudinary here
    }

    const complaint = await Complaint.create({
        title,
        description,
        category,
        location,
        priority: priority || "Medium",
        image: imageLocalPath || "",
        complainant: req.user._id, // Assumes authMiddleware sets req.user
        history: [{ action: "Complaint Registered", by: req.user._id }]
    });

    if (!complaint) {
        throw new APIError(500, "Failed to register complaint");
    }

    return res.status(201).json(
        new APIResponse(201, complaint, "Complaint registered successfully")
    );
});

// 2. Get All Complaints (Admin) or My Complaints (Student)
const getComplaints = asyncHandler(async (req, res) => {
    let query = {};

    // If user is Student/Faculty, show only their complaints
    if (req.user.role === "student" || req.user.role === "faculty") {
        query.complainant = req.user._id;
    }
    // If Technician, show only assigned to them
    else if (req.user.role === "technician") {
        query.assignedTo = req.user._id;
    }
    // Admins see everything (query remains empty)

    const complaints = await Complaint.find(query)
        .populate("complainant", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    return res.status(200).json(
        new APIResponse(200, complaints, "Complaints fetched successfully")
    );
});

// 3. Assign Complaint (Admin Only) 
const assignComplaint = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const { technicianId } = req.body;
    if (req.user.role !== "admin") {
        throw new APIError(403, "Only admin can assign complaints");
    }
    const technician = await User.findOne({
        _id: technicianId,
        role: "staff"
    });
    if (!technician) {
        throw new APIError(400, "Technician not found or invalid role");
    }
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new APIError(404, "Complaint not found");
    }

    complaint.assignedTo = technicianId;
    complaint.status = "Assigned";
    complaint.history.push({
        action: `Assigned to Technician`,
        by: req.user._id
    });

    await complaint.save();

    return res.status(200).json(
        new APIResponse(200, complaint, "Technician assigned successfully")
    );
});

// 4. Update Status (Technician) 
const updateStatus = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const { status } = req.body;

    const validStatuses = ["In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
        throw new APIError(400, "Invalid status update");
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new APIError(404, "Complaint not found");
    }

    // Verify the technician owns this task
    if (complaint.assignedTo.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new APIError(403, "You are not authorized to update this complaint");
    }

    complaint.status = status;
    complaint.history.push({
        action: `Status updated to ${status}`,
        by: req.user._id
    });

    await complaint.save();

    return res.status(200).json(
        new APIResponse(200, complaint, "Status updated successfully")
    );
});

export { registerComplaint, getComplaints, assignComplaint, updateStatus };