import { Router } from "express";
import { createProject } from "./controller.js";

const projectRouter = Router();

projectRouter.post("/", createProject)

export default projectRouter;