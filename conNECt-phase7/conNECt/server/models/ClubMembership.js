import mongoose from "mongoose";

const clubMembershipSchema = new mongoose.Schema(
  {
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

clubMembershipSchema.index({ club: 1, user: 1 }, { unique: true });

const ClubMembership = mongoose.model("ClubMembership", clubMembershipSchema);
export default ClubMembership;
