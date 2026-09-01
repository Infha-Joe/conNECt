import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: null },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    venue: { type: String, trim: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    registrationDeadline: { type: Date },
    capacity: { type: Number, default: 0 },
    status: { type: String, enum: ["upcoming", "ongoing", "completed", "cancelled"], default: "upcoming" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

eventSchema.index({ eventDate: 1 });
eventSchema.index({ department: 1 });
eventSchema.index({ club: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
