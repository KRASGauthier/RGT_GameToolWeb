import { Router } from "express";
import { createProject, projectGetAllFromUser } from "./controller.js";

const projectRouter = Router();

projectRouter.post("/", createProject);
projectRouter.get("/", projectGetAllFromUser);

export default projectRouter;
