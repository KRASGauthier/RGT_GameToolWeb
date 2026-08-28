import type { Request, Response } from "express";
import { User } from "../users/schema.js";
import type { IAPIUserGetSelfFull } from "../../types/api/users/TAPIUsers.js";

export const getUserSelfFull = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const user = await User.findById(req.user);
	if (!user) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: user.getUserFull(),
	} as IAPIUserGetSelfFull);
};

export const patchUserSelf = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const updatedUser = await User.findByIdAndUpdate(req.user, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updatedUser) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: updatedUser.getUserFull(),
	});
};
