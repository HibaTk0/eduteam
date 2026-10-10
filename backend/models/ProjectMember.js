import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["chef", "membre", "encadrant"],
      default: "membre",
    },
  },
  { timestamps: true }
);

// un utilisateur ne peut être membre qu'une fois par projet
projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

export default mongoose.model("ProjectMember", projectMemberSchema);