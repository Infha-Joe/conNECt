import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, maxlength: 300 },
    iconUrl: { type: String, default: "" },
    criteria: { type: String, enum: ["auto", "manual"], default: "manual" },
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
