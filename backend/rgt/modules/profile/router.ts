import express from "express";
import { getUserSelfFull, patchUserSelf } from "./controller.js";
import { verifyJWT } from "../../middleware/jwt.js";

const profileRouter = express.Router();

profileRouter.get("/", verifyJWT, getUserSelfFull);

profileRouter.patch("/", verifyJWT, patchUserSelf);

export default profileRouter;