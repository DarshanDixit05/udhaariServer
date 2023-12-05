import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
    },
    peerId: {
        type: String,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Blocked"],
        default: "Active",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    }
})

friendSchema.index({ userId: 1, peerId: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;