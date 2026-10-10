import mongoose from "mongoose";
import ProjectMember from "../models/ProjectMember.js";

// Exemple : projectRole("chef") ou projectRole() pour tout membre
export const projectRole =
  (...roles) =>
  async (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Identifiant de projet invalide" });
    }

    const membership = await ProjectMember.findOne({
      project: projectId,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({ message: "Vous n'êtes pas membre de ce projet" });
    }

    if (roles.length && !roles.includes(membership.role)) {
      return res.status(403).json({ message: "Action réservée au chef de projet" });
    }

    req.membership = membership;
    next();
  };