import { Router } from "express";
import {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  updateMemberRole,
  removeMember,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import { projectRole } from "../middleware/projectRole.js";

const router = Router();

router.use(protect);

router.post("/", createProject);
router.get("/", getMyProjects);

router.get("/:projectId", projectRole(), getProject);
router.put("/:projectId", projectRole("chef"), updateProject);
router.delete("/:projectId", projectRole("chef"), deleteProject);

router.post("/:projectId/members", projectRole("chef"), addMember);
router.put("/:projectId/members/:userId", projectRole("chef"), updateMemberRole);
router.delete("/:projectId/members/:userId", projectRole("chef"), removeMember);

export default router;