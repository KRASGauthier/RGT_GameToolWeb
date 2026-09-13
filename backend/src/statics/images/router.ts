import express, { Router } from "express";
import { IMG_USERS } from "../../../rgt/consts.js";
import { getPath } from "../../../rgt/util/UImages.js";
import { IMG_PROJECT } from "../../consts.js";
import { verifyJWT } from "../../../rgt/middleware/jwt.js";

const imageRouter = Router();

imageRouter.use(IMG_USERS, express.static(getPath(IMG_USERS)));
imageRouter.use(IMG_PROJECT, verifyJWT, express.static(getPath(IMG_PROJECT)));

export default imageRouter;
