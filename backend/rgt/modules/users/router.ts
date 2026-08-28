import express from "express";
import { postUser, postUserAvailable, getUserSelfFull, getUserSelf } from "./controller.js";
import { API_USER_CHECK_AVAILABLE, API_USER_SELF, LIMITER_REGISTER } from "../../consts.js";
import { verifyJWT } from "../../middleware/jwt.js";
import createLimiter from "../../middleware/limiter.js";

const userRouter = express.Router();
const limiter = createLimiter(LIMITER_REGISTER);

userRouter.post("/", limiter, postUser);
userRouter.get("/", getUserSelf);
userRouter.post(API_USER_CHECK_AVAILABLE, postUserAvailable);

userRouter.get(API_USER_SELF, verifyJWT, getUserSelfFull);

export default userRouter;
