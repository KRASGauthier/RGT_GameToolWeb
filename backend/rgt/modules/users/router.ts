import express from "express";
import { postUser, postUserAvailable, getUserSelfFull } from "./controller.js";
import { API_USER_CHECK_AVAILABLE, API_USER_SELF } from "../../consts.js";
import { verifyJWT } from "../../middleware/jwt.js";

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.post(API_USER_CHECK_AVAILABLE, postUserAvailable);

userRouter.get(API_USER_SELF, verifyJWT, getUserSelfFull);

export default userRouter;
