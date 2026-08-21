import type { Request, Response } from "express";
import { User } from "./schema.js";
import {
	IAPIUserCheckAvailableRcv,
	IAPIUserGetSelfFull,
	IAPIUserRegister,
} from "../../types/api/users/TAPIUsers.js";
import argon2 from "argon2";
import { PASSWORD_MAX, PASSWORD_MIN } from "../../consts.js";
import { checkField } from "../../util/UError.js";

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
//                    MANAGE
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

export const postUserAvailable = async (req: Request, res: Response) => {
	if (!("username" in req.body)) {
		res.status(200).json({ available: false } as IAPIUserCheckAvailableRcv);
		return;
	}

	res.status(200).json({
		available: (await User.exists({ username: req.body.username })) === null,
	} as IAPIUserCheckAvailableRcv);
};

//--------------------------------------------------
//                      INFO
//--------------------------------------------------
export const getUserSelfFull = async (req: Request, res: Response) => {
	if (!req.user) throw { code: 400, message: "Missing user id" };

	const user = await User.findById(req.user);
	if (!user) throw { code: 404, message: "User not found" };

	res.status(200).json({
		user: user.getUserFull(),
	} as IAPIUserGetSelfFull);
};
