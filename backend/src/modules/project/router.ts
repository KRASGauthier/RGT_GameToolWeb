import { Router } from "express";
import {
	createProject,
	projectGet,
	projectGetAllFromUser,
	projectModify,
	projectModifyPicture,
} from "./controller.js";
import { API_GROUPS, API_PROJECT_TARGET, API_PROJECT_TARGET_PICTURE } from "../../consts.js";
import { verifyProject } from "./middleware.js";
import { uploadInMemory } from "../../../rgt/middleware/upload.js";
import groupRouter from "./groups/router.js";

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

//GOUPS
projectRouter.use(API_PROJECT_TARGET + API_GROUPS, verifyProject, groupRouter);

export default projectRouter;
