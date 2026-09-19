import { Router } from "express";
import { groupCreate, groupDelete, groupEdit, groupsGet } from "./controller.js";
import { API_GROUPS_TARGET } from "../../../consts.js";
import { verifyGroup } from "./middleware.js";

const groupRouter = Router();

groupRouter.get("/", groupsGet);
groupRouter.post("/", groupCreate);
groupRouter.patch(API_GROUPS_TARGET, verifyGroup, groupEdit);
groupRouter.delete(API_GROUPS_TARGET, verifyGroup, groupDelete);

export default groupRouter;
