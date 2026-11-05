import { Router } from "express";
import {
	createProject,
	projectGet,
	projectGetAllFromUser,
	projectModify,
	projectModifyPicture,
} from "./controller.js";
import {
	API_GROUPS,
	API_PROJECT_TARGET,
	API_PROJECT_TARGET_PICTURE,
	API_PROJECT_TODO,
	API_PROJECT_USER,
} from "../../consts.js";
import { verifyProject } from "./middleware.js";
import { uploadInMemory } from "../../../rgt/middleware/upload.js";
import groupRouter from "./groups/router.js";
import RProjectUserRouter from "./projectUsers/router.js";
import todoRouter from "./todo/router.js";

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

//PROJECT USERS
projectRouter.use(API_PROJECT_TARGET + API_PROJECT_USER, verifyProject, RProjectUserRouter);


//TODOS
projectRouter.use(API_PROJECT_TARGET + API_PROJECT_TODO, verifyProject, todoRouter)

export default projectRouter;
