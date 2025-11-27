import mongoose from "mongoose";

const systemLogSchema = new mongoose.Schema({
  device: { type: String, required: true },
  lastBootTime: { type: Date, required: true },
  lastShutdownTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SystemLog", systemLogSchema);
