import mongoose from "mongoose";

// Define the schema
const SubmissionSchema = new mongoose.Schema({
  mistake: { type: String, required: true },
  details: { type: String },
  fixes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite on hot reloads in dev
export const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
