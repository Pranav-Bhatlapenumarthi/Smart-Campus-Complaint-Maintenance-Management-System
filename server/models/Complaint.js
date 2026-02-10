import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ["Electrical", "Plumbing", "Infrastructure", "Internet", "Other"], 
        required: true 
    },
    location: { type: String, required: true }, // 
    priority: { 
        type: String, 
        enum: ["Low", "Medium", "High"], 
        default: "Medium" 
    },
    image: { type: String }, // URL to the uploaded proof
    status: { 
        type: String, 
        enum: ["Pending", "Assigned", "In Progress", "Resolved"], 
        default: "Pending" 
    },
    complainant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" // Technician
    },
    history: [{ // Audit trail [cite: 97]
        action: String,
        timestamp: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
}, { timestamps: true });

export const Complaint = mongoose.model("Complaint", complaintSchema);