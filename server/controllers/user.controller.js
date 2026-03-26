import { User } from "../models/User.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get all technicians (staff members)
const getTechnicians = asyncHandler(async (req, res) => {
    const technicians = await User.find({ role: "technician" }).select("_id name email");
    
    if (!technicians) {
        throw new APIError(500, "Failed to fetch technicians");
    }

    return res.status(200).json(
        new APIResponse(200, technicians, "Technicians fetched successfully")
    );
});

// Get single user by ID
const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
        throw new APIError(404, "User not found");
    }

    return res.status(200).json(
        new APIResponse(200, user, "User fetched successfully")
    );
});

// Get all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new APIError(403, "Only admin can access this route");
    }

    const users = await User.find().select("-password");
    
    return res.status(200).json(
        new APIResponse(200, users, "All users fetched successfully")
    );
});

export { getTechnicians, getUserById, getAllUsers };
