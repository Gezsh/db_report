import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  databaseName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  databaseType: { type: String, required: true },
  osVersion: { type: String, required: true },
  dbVersion: { type: String, required: true },
  synchronization: { type: String, required: true }, 
  backupCompleted: { type: String, required: true }, 
  resourceAvailability: { type: String, required: true }, 
  anyIncident: { type: String, required: true },
  remark: { type: String, required: true },
  file: { type: String },
  synchronizationFile: { type: String },
  backupFile: { type: String },
  resourceFile: { type: String },
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);
