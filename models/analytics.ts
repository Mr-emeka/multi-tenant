import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  eventId: String,
  ip: String,
  visitId: { type: String },
  location: { type: String },
  type: { type: String, enum: ["checkout", "click", "views"] },
  isReturningVisitor: { type: Boolean },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);
