import express from "express";
import {
	API_AUTH_LOGOUT,
	API_AUTH_LOGOUT_EVERYWHERE,
	API_AUTH_REFRESH,
	LIMITER_LOGIN,
} from "../../consts.js";
import {
	getAuthRefresh,
	postAuth,
	postAuthLogout,
	postAuthLogoutEverywhere,
} from "./controller.js";
import createLimiter from "../../middleware/limiter.js";

const authRouter = express.Router();
const limiter = createLimiter(LIMITER_LOGIN);

authRouter.post("/", limiter, postAuth);
authRouter.get(API_AUTH_REFRESH, getAuthRefresh);
authRouter.post(API_AUTH_LOGOUT, postAuthLogout);
authRouter.post(API_AUTH_LOGOUT_EVERYWHERE, postAuthLogoutEverywhere);

export default authRouter;
