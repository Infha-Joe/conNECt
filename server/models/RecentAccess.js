import mongoose from "mongoose";

const recentAccessSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resourceType: { type: String, required: true }, // e.g., "project", "mentorship", "post"
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    accessedAt: { type: Date, default: Date.now }
});

recentAccessSchema.index({ user: 1, resourceId: 1 }, { unique: true });

const RecentAccess = mongoose.model("RecentAccess", recentAccessSchema);
export default RecentAccess;
