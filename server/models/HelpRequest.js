import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    helpNeeded: { type: String, required: true },
    deadline: { type: Date },
    attachment: { type: String },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'pending_confirmation', 'completed', 'cancelled'],
      default: 'open',
    },
    acceptedHelper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completionConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

helpRequestSchema.index({ status: 1, createdAt: -1 });
helpRequestSchema.index({ requester: 1 });
helpRequestSchema.index({ subject: 1, topic: 1 });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
export default HelpRequest;

