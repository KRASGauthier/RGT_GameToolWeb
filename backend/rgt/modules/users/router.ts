import express from "express";
import {
	postUser,
	postUserAvailable,
	getUserSelfFull,
	getUserSelf,
	patchUserSelf,
	patchUserSelfAvatar,
	patchUserPassword,
} from "./controller.js";
import { API_USER_CHECK_AVAILABLE, API_USER_SELF, API_USER_SELF_PASSWORD, API_USER_SELF_AVATAR, LIMITER_REGISTER } from "../../consts.js";
import { verifyJWT } from "../../middleware/jwt.js";
import createLimiter from "../../middleware/limiter.js";
import { uploadImage } from "../../middleware/upload.js";

const userRouter = express.Router();
const limiter = createLimiter(LIMITER_REGISTER);

userRouter.post("/", limiter, postUser);
userRouter.get("/", getUserSelf);
userRouter.post(API_USER_CHECK_AVAILABLE, postUserAvailable);

userRouter.get(API_USER_SELF, verifyJWT, getUserSelfFull);
userRouter.patch(API_USER_SELF, verifyJWT, patchUserSelf);
userRouter.patch(API_USER_SELF + API_USER_SELF_AVATAR, verifyJWT, uploadImage.single("avatar"), patchUserSelfAvatar);
userRouter.patch(API_USER_SELF + API_USER_SELF_PASSWORD, verifyJWT, patchUserPassword);

export default userRouter;
