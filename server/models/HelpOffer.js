import mongoose from 'mongoose';

const helpOfferSchema = new mongoose.Schema(
  {
    helpRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest', required: true },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

helpOfferSchema.index({ helpRequest: 1, helper: 1 }, { unique: true });

const HelpOffer = mongoose.model('HelpOffer', helpOfferSchema);
export default HelpOffer;

