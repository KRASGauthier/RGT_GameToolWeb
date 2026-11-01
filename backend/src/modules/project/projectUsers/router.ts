import { Router } from "express";
import { API_PROJECT_USER_GROUPS, API_PROJECT_USER_TARGET } from "../../../consts.js";
import { projectUserAdd, projectUserChangeGroup, projectUserDelete } from "./controller.js";
import { verifyProjectUser } from "./middleware.js";

const RProjectUserRouter = Router();

RProjectUserRouter.post("/", projectUserAdd);
RProjectUserRouter.patch(
	API_PROJECT_USER_TARGET + API_PROJECT_USER_GROUPS,
	verifyProjectUser,
	projectUserChangeGroup,
);
RProjectUserRouter.delete(API_PROJECT_USER_TARGET, verifyProjectUser, projectUserDelete);

export default RProjectUserRouter;
