import type { Request, Response } from "express";
import { User } from "./schema.js";
import { IAPIUserCheckAvailableRcv, IAPIUserRegister } from "../types/api/users/TAPIUsers.js";

//--------------------------------------------------
//                    MANAGE
//--------------------------------------------------
export const postUser = async (req: Request, res: Response) => {
	const data: IAPIUserRegister = req.body as IAPIUserRegister;
	await User.create(data.user);
	res.status(201).json({});
};

export const postUserAvailable = async (req: Request, res: Response) => {
	console.log(req.body);
	if (!("username" in req.body)) {
		res.status(200).json({ available: false } as IAPIUserCheckAvailableRcv);
		return;
	}
	console.log(await User.find({ username: req.body.username }));
	res.status(200).json({
		available: (await User.find({ username: req.body.username })).length == 0,
	} as IAPIUserCheckAvailableRcv);
};
