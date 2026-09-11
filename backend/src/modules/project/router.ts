import { Router } from "express";
import {
	createProject,
	projectGet,
	projectGetAllFromUser,
	projectModify,
	projectModifyPicture,
} from "./controller.js";
import { API_PROJECT_TARGET, API_PROJECT_TARGET_PICTURE } from "../../consts.js";
import { verifyProject } from "../../middleware/project.js";
import { uploadInMemory } from "../../../rgt/middleware/upload.js";

const projectRouter = Router();

projectRouter.post("/", createProject);
projectRouter.get("/", projectGetAllFromUser);
projectRouter.get(API_PROJECT_TARGET, verifyProject, projectGet);
projectRouter.patch(API_PROJECT_TARGET, verifyProject, projectModify);
projectRouter.patch(
	API_PROJECT_TARGET + API_PROJECT_TARGET_PICTURE,
	uploadInMemory.single("picture"),
	verifyProject,
	projectModifyPicture,
);

export default projectRouter;
