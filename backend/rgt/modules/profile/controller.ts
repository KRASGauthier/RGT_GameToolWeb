import type { Request, Response } from "express";
import { User } from "../users/schema.js";
import type { IAPIUserGetSelfFull } from "../../types/api/users/TAPIUsers.js";

// GET /users/self - Get current user profile
export const getUserSelfFull = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const user = await User.findById(req.user);
	if (!user) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: user.getUserFull(),
	} as IAPIUserGetSelfFull);
};

// PATCH /users/self - Update current user profile
export const patchUserSelf = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const { firstName, lastName, username } = req.body;

	// Only update fields that were provided
	const update: {
		firstName?: string;
		lastName?: string;
		username?: string;
	} = {};

	if (firstName !== undefined) update.firstName = firstName.trim();
	if (lastName !== undefined) update.lastName = lastName.trim();
	if (username !== undefined) update.username = username.trim();

	const updatedUser = await User.findByIdAndUpdate(
		req.user,
		update,
		{ new: true }
	);

	if (!updatedUser) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: updatedUser.getUserFull(),
	});
};