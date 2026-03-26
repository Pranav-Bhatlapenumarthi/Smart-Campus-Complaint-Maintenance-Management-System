import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ["Electrical", "Plumbing", "Infrastructure", "Internet", "HVAC", "IT/Network", "Furniture", "Cleaning", "Safety", "Other"], 
        required: true 
    },
    location: { type: String, required: true },
    priority: { 
        type: String, 
        enum: ["low", "medium", "high"], 
        default: "medium",
        lowercase: true
    },
    image: { type: String },
    status: { 
        type: String, 
        enum: ["pending", "assigned", "in-progress", "resolved", "closed"], 
        default: "pending",
        lowercase: true
    },
    complaint: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    history: [{ 
        action: String,
        timestamp: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
}, { timestamps: true });

export const Complaint = mongoose.model("Complaint", complaintSchema);