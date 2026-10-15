import Counter from "../models/Counter.js";

export const generateConnectId = async () => {
  const currentYear = new Date().getFullYear();
  
  const counter = await Counter.findByIdAndUpdate(
    { _id: `connectId_${currentYear}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(6, "0");
  return `CNCT-${currentYear}-${paddedSeq}`;
};
