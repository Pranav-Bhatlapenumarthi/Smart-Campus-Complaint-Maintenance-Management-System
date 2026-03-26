import { Complaint } from "../models/Complaint.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { User } from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// 1. Register Complaint (Student/Faculty)
const registerComplaint = asyncHandler(async (req, res) => {
    const { title, description, category, location, priority } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
        throw new APIError(400, "All fields (title, description, category, location) are required");
    }

    if ([title, description, category, location].some((field) => field?.trim() === "")) {
        throw new APIError(400, "All fields must be non-empty");
    }

    // Handle Image Upload
    let imageLocalPath = "";
    if (req.file) {
        imageLocalPath = req.file.path;
    }

    const complaint = await Complaint.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        location: location.trim(),
        priority: priority || "medium",
        image: imageLocalPath,
        complaint: req.user._id, // Fixed: changed from complainant to complaint (matches model)
        history: [{ action: "Complaint Registered", by: req.user._id }]
    });

    if (!complaint) {
        throw new APIError(500, "Failed to register complaint");
    }

    console.log('New complaint created:', complaint);

    return res.status(201).json(
        new APIResponse(201, complaint, "Complaint registered successfully")
    );
});

// 2. Get All Complaints (Admin) or My Complaints (Student/Faculty)
const getComplaints = asyncHandler(async (req, res) => {
    let query = {};

    console.log('=== GET COMPLAINTS ===');
    console.log('User role:', req.user.role, 'User ID:', req.user._id);

    // If user is Student/Faculty, show only their complaints
    if (req.user.role === "student" || req.user.role === "faculty") {
        query.complaint = req.user._id;
        console.log(`${req.user.role.toUpperCase()} - Query:`, query);
    }
    // If Technician, show only assigned to them
    else if (req.user.role === "technician" || req.user.role === "staff") {
        query.assignedTo = req.user._id;
        console.log(`${req.user.role.toUpperCase()} - Query:`, query);
    }
    // Admins see everything (query remains empty)
    else {
        console.log('ADMIN - Showing all complaints');
    }

    const complaints = await Complaint.find(query)
        .populate("complaint", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    
    console.log(`Fetched ${complaints.length} complaints for ${req.user.role} user`);
    
    if (complaints.length > 0) {
        console.log('Sample complaint:', JSON.stringify(complaints[0], null, 2));
    }
    
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
        role: "technician"
    });
    
    if (!technician) {
        throw new APIError(400, "Technician not found or invalid role");
    }
    
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new APIError(404, "Complaint not found");
    }

    complaint.assignedTo = technicianId;
    complaint.status = "assigned";
    complaint.history.push({
        action: `Assigned to Technician`,
        by: req.user._id
    });

    await complaint.save();

    return res.status(200).json(
        new APIResponse(200, complaint, "Technician assigned successfully")
    );
});

// 4. Update Status (Technician or Admin) 
const updateStatus = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const { status } = req.body;

    console.log('=== UPDATE STATUS ===');
    console.log('Complaint ID:', complaintId);
    console.log('New status:', status);
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user._id);

    const validStatuses = ["in-progress", "resolved", "closed"];
    if (!validStatuses.includes(status?.toLowerCase())) {
        throw new APIError(400, "Invalid status update. Valid statuses: " + validStatuses.join(", "));
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new APIError(404, "Complaint not found");
    }

    console.log('Complaint assignedTo:', complaint.assignedTo);
    console.log('Current status:', complaint.status);

    // Verify authorization: Technician must be assigned, Admin can update any
    const isAdmin = req.user.role === "admin";
    const isTechnicianAssigned = complaint.assignedTo && complaint.assignedTo.toString() === req.user._id.toString();
    
    console.log('Is Admin:', isAdmin);
    console.log('Is Technician Assigned:', isTechnicianAssigned);
    
    if (!isAdmin && !isTechnicianAssigned) {
        throw new APIError(403, "You are not authorized to update this complaint");
    }

    complaint.status = status.toLowerCase();
    complaint.history.push({
        action: `Status updated to ${status}`,
        by: req.user._id
    });

    await complaint.save();

    console.log('Complaint updated successfully. New status:', complaint.status);

    return res.status(200).json(
        new APIResponse(200, complaint, "Status updated successfully")
    );
});

export { registerComplaint, getComplaints, assignComplaint, updateStatus };