import express from "express";
import { postUser, postUserAvailable } from "./controller.js";
import { API_USER_CHECK_AVAILABLE } from "../consts.js";

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.post(API_USER_CHECK_AVAILABLE, postUserAvailable);

export default userRouter;
