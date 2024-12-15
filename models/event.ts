import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userId: String,
  name: String,
  timestamp: Date,
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
