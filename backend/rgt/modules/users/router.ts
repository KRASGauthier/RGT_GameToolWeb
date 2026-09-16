import express from "express";
import {
	postUser,
	postUserAvailable,
	getUserSelf,
	patchUserSelf,
	patchUserSelfAvatar,
	patchUserPassword,
	userGetSearch,
} from "./controller.js";
import {
	API_USER_CHECK_AVAILABLE,
	API_USER_SELF,
	API_USER_SELF_PASSWORD,
	API_USER_SELF_AVATAR,
	LIMITER_REGISTER,
	API_USER_REGISTER,
} from "../../consts.js";
import { verifyJWT } from "../../middleware/jwt.js";
import createLimiter from "../../middleware/limiter.js";
import { uploadInMemory } from "../../middleware/upload.js";

const userRouter = express.Router();
const limiter = createLimiter(LIMITER_REGISTER);

//ACCESS
//Shared
userRouter.post("/", userGetSearch);
userRouter.post(API_USER_CHECK_AVAILABLE, postUserAvailable);

//Self
userRouter.get(API_USER_SELF, verifyJWT, getUserSelf);

//MANAGE
userRouter.post(API_USER_REGISTER, limiter, postUser);
userRouter.patch(API_USER_SELF, verifyJWT, patchUserSelf);
userRouter.patch(
	API_USER_SELF + API_USER_SELF_AVATAR,
	verifyJWT,
	uploadInMemory.single("avatar"),
	patchUserSelfAvatar,
);
userRouter.patch(API_USER_SELF + API_USER_SELF_PASSWORD, verifyJWT, patchUserPassword);

export default userRouter;
