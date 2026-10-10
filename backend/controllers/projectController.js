import Joi from "joi";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";

const projectSchema = Joi.object({
  titre: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  dateDebut: Joi.date(),
  dateFin: Joi.date(),
});

// US05 : créer un projet (le créateur devient chef de projet)
export const createProject = async (req, res) => {
  const { error, value } = projectSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const project = await Project.create({ ...value, createdBy: req.user.id });
  await ProjectMember.create({
    project: project._id,
    user: req.user.id,
    role: "chef",
  });

  res.status(201).json({ project });
};

// US19 : voir la liste de mes projets
export const getMyProjects = async (req, res) => {
  const memberships = await ProjectMember.find({ user: req.user.id }).populate(
    "project"
  );
  const projects = memberships
    .filter((m) => m.project)
    .map((m) => ({ ...m.project.toObject(), monRole: m.role }));
  res.json({ projects });
};