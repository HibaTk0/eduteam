import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    filiere: { type: String, trim: true },
    photo: { type: String, default: "" },
    role: {
      type: String,
      enum: ["etudiant", "encadrant", "admin"],
      default: "etudiant",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);