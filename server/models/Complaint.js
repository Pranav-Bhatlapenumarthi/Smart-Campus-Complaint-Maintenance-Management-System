import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Electrical', 'Plumbing', 'Infrastructure', 'Internet'], required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { 
        type: String, 
        enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'], 
        default: 'Pending' 
    },
    image: {
      type: String,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [{ 
        action: String,
        date: { type: Date, default: Date.now },
        by: String
    }]
}, {timestamps:true});

export const Complaint=mongoose.model("Complaint", ComplaintSchema);