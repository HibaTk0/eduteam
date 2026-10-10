import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    statut: {
      type: String,
      enum: ["actif", "archive"],
      default: "actif",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);