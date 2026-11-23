import { Router } from "express";
import { tagCreate, tagEdit, tagGetAll } from "./controller.js";
import { verifyTag } from "./middleware.js";
import { API_TAG_GLOBAL_ID } from "../../../../rgt/consts.js";

const RTagRouter = Router();

RTagRouter.get("/", tagGetAll);
RTagRouter.post("/", tagCreate);
RTagRouter.post(API_TAG_GLOBAL_ID, verifyTag, tagEdit);

export default RTagRouter;
