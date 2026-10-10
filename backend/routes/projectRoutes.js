import { Router } from "express";
import { createProject, getMyProjects } from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect); // toutes les routes projets exigent d'être connecté

router.post("/", createProject);
router.get("/", getMyProjects);

export default router;