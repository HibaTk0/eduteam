import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/User.js";

const registerSchema = Joi.object({
  nom: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  filiere: Joi.string().allow(""),
  role: Joi.string().valid("etudiant", "encadrant"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const publicUser = (u) => ({
  id: u._id,
  nom: u.nom,
  email: u.email,
  filiere: u.filiere,
  photo: u.photo,
  role: u.role,
});

export const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

  const hash = await bcrypt.hash(value.password, 10);
  const user = await User.create({ ...value, password: hash });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

export const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ message: "Identifiants incorrects" });

  const ok = await bcrypt.compare(value.password, user.password);
  if (!ok) return res.status(401).json({ message: "Identifiants incorrects" });

  res.json({ token: signToken(user), user: publicUser(user) });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json({ user: publicUser(user) });
};