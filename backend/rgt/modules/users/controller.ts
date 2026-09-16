import type { Request, Response } from "express";
import { User } from "./schema.js";
import {
	IAPIUserPatchSelfChecker,
	IAPIChangePasswordChecker,
	IAPIUserCheckAvailableRcv,
	IAPIUserGetSelfFull,
	IAPIUserPatchSelf,
	IAPIUserRegister,
	IAPIChangePassword,
	IAPIUserSearch,
	IAPIUserSearchChecker,
	IAPIUserList,
} from "../../types/api/users/TAPIUsers.js";
import argon2 from "argon2";
import { IMG_USERS, IMG_USERS_AVATAR, PASSWORD_MAX, PASSWORD_MIN } from "../../consts.js";
import { checkApi } from "../../util/UApi.js";
import { checkField, hasUser } from "../../util/UError.js";
import sharp from "sharp";
import { makeFrontPath, makePath } from "../../util/UImages.js";
import { IMG_PROJECT_UID } from "../../../src/consts.js";

//--------------------------------------------------
//                   HELPERS
//--------------------------------------------------
function checkPassword(pwd: string) {
	if (typeof pwd != "string") throw { code: 400, message: "Wrong password type" };

	const trimed = pwd.trim();
	if (!trimed) throw { code: 400, message: "Empty password" };
	if (!trimed.match(/^[\x21-\x7E]+$/))
		throw { code: 400, message: "Unallowed charcter is begin used" };
	if (trimed.length < PASSWORD_MIN || trimed.length > PASSWORD_MAX)
		throw { code: 400, message: "Must contain between 8 and 20 characters" };
	if (!trimed.match(/[A-Z]/)) throw { code: 400, message: "Must contain at least: 1 uppercase" };
	if (!trimed.match(/[0-9]/)) throw { code: 400, message: "Must contain at least: 1 number" };
	if (!trimed.match(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/))
		throw { code: 400, message: "Must contain at least: 1 special character" };
}

//--------------------------------------------------
//                    ACCESS
//--------------------------------------------------
//Shared
export const userGetSearch = async (req: Request, res: Response) => {
	const data: IAPIUserSearch = checkApi<IAPIUserSearch>(req.body, IAPIUserSearchChecker);
	const users = await User.find({
		username: { $regex: data.search.trim().toLocaleLowerCase(), $options: "i" },
	});
	res.status(200).json({
		users: users.map((user) => {
			return user.getUserBase();
		}),
	} as IAPIUserList);
};
export const postUserAvailable = async (req: Request, res: Response) => {
	if (!("username" in req.body)) {
		res.status(200).json({ available: false } as IAPIUserCheckAvailableRcv);
		return;
	}

	res.status(200).json({
		available: (await User.exists({ username: req.body.username })) === null,
	} as IAPIUserCheckAvailableRcv);
};

//Self
export const getUserSelf = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const user = await User.findById(req.user);
	if (!user) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: user.getUserFull(),
	} as IAPIUserGetSelfFull);
};

//--------------------------------------------------
//                      MANAGE
//--------------------------------------------------
export const postUser = async (req: Request, res: Response) => {
	checkField("user", req.body);
	const data: IAPIUserRegister = req.body as IAPIUserRegister;
	checkPassword(data.user.password);
	await User.create({
		...data.user,
		password: await argon2.hash(data.user.password.trim()),
	});
	res.status(201).json({});
};
export const patchUserSelf = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };
	const update: IAPIUserPatchSelf = checkApi<IAPIUserPatchSelf>(
		req.body,
		IAPIUserPatchSelfChecker,
	);

	const updatedUser = await User.findByIdAndUpdate(req.user, update, {
		returnDocument: "after",
		runValidators: true,
	});

	if (!updatedUser) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: updatedUser.getUserFull(),
	} as IAPIUserGetSelfFull);
};

export const patchUserSelfAvatar = async (req: Request, res: Response) => {
	hasUser(req);
	if (!req.file?.buffer) throw { code: 400, message: "Avatar file missing" };

	const user = await User.findById(req.user);
	if (!user) throw { code: 404, message: "User not found" };

	console.log(
		makePath(IMG_USERS, IMG_PROJECT_UID.replaceAll(":uid", req.user)) + IMG_USERS_AVATAR,
	);
	await sharp(req.file?.buffer)
		.resize(512, 512, { fit: "cover", position: "center" })
		.png()
		.toFile(
			makePath(IMG_USERS, IMG_PROJECT_UID.replaceAll(":uid", req.user)) + IMG_USERS_AVATAR,
		);
	user.avatar =
		makeFrontPath(IMG_USERS, IMG_PROJECT_UID.replaceAll(":uid", req.user)) + IMG_USERS_AVATAR;
	await user.save();

	res.status(200).json({
		user: user.getUserFull(),
	} as IAPIUserGetSelfFull);
};

export const patchUserPassword = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const data: IAPIChangePassword = checkApi<IAPIChangePassword>(
		req.body,
		IAPIChangePasswordChecker,
	);

	const user = await User.findById(req.user);
	if (!user) throw { code: 404, message: "User not found" };

	const isValid = await argon2.verify(user.password, data.currentPassword);
	if (!isValid) throw { code: 401, message: "Current password is incorrect" };

	checkPassword(data.newPassword);

	const hashedPassword = await argon2.hash(data.newPassword.trim());
	user.password = hashedPassword;
	await user.save();

	res.status(200).json({
		message: "Password changed successfully",
	});
};
