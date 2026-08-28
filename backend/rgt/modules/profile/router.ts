import express from "express";
import { getUserSelfFull, patchUserSelf } from "./controller.js";
import { verifyJWT } from "../../middleware/jwt.js";

const profileRouter = express.Router();

// GET /profile - Get current user profile
profileRouter.get("/", verifyJWT, getUserSelfFull);

// PATCH /profile - Update current user profile
profileRouter.patch("/", verifyJWT, patchUserSelf);

export default profileRouter;