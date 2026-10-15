import RecentAccess from "../models/RecentAccess.js";
import asyncHandler from "express-async-handler";

export const getRecentAccess = asyncHandler(async (req, res) => {
    const recent = await RecentAccess.find({ user: req.user._id })
        .sort({ accessedAt: -1 })
        .limit(10);
    res.json({ success: true, recent });
});

export const addRecentAccess = asyncHandler(async (req, res) => {
    const { resourceType, resourceId, title, link } = req.body;

    if (!resourceType || !resourceId || !title || !link) {
        res.status(400);
        throw new Error("Missing required fields");
    }

    // Upsert to avoid duplicates and update timestamp
    const recent = await RecentAccess.findOneAndUpdate(
        { user: req.user._id, resourceId },
        { resourceType, title, link, accessedAt: Date.now() },
        { new: true, upsert: true }
    );

    res.json({ success: true, recent });
});
