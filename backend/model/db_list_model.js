import mongoose from "mongoose";

const DbSchema = new mongoose.Schema({
  databaseName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  databaseType: { type: String, required: true },
  osVersion: { type: String, required: true },
  dbVersion: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("db_list", DbSchema);
