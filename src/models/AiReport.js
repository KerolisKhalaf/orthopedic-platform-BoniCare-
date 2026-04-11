import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalFile", default: null },
  model_name: { type: String, default: "ortho-ai-v1" },
  output_json: { type: Object, required: true },
  confidence: { type: Number, default: 0 },
  explainability_path: { type: String, default: null }, // heatmap image path
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AiReport", aiReportSchema);
