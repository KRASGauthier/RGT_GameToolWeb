import type { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { checkField } from "../../util/UError.js";
import { User } from "../users/schema.js";
import { IAPIAuthLogin, IAPIAccess } from "../../types/api/auth/TAPIAuth.js";
import { IUserTokenMin } from "../../types/data/TUser.js";
import { TIME_1W } from "../../consts.js";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "../../../rgt/backendConsts.js";

export const postAuth = async (req: Request, res: Response) => {
	checkField("email", req.body);
	checkField("password", req.body);
	const body: IAPIAuthLogin = req.body as IAPIAuthLogin;

	const user = await User.findOne({ email: body.email });
	if (!user) throw { code: 401, message: "Can't login email or password is wrong" };

	if (!(await argon2.verify(user.password, body.password)))
		throw { code: 401, message: "Can't login email or password is wrong" };

	if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)
		throw { code: 500, message: "failed to start JWT" };

	const accessToken = jwt.sign(
		{
			uid: user._id.toString(),
		} as IUserTokenMin,
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: ACCESS_TOKEN_EXP },
	);

	const refreshToken = jwt.sign(
		{
			uid: user._id.toString(),
		} as IUserTokenMin,
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: REFRESH_TOKEN_EXP },
	);

	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: TIME_1W,
	});

	res.status(200).json({ token: accessToken, user: user.getUserBase() } as IAPIAccess);
};

export const getAuthRefresh = async (req: Request, res: Response) => {
	const refreshToken: string | undefined = req.cookies.jwt;

	if (!refreshToken) throw { code: 401, message: "Unauthorized" };

	if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)
		throw { code: 500, message: "failed to start JWT" };

	let decoded: IUserTokenMin;
	try {
		decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as IUserTokenMin;
	} catch {
		throw { code: 401, message: "Unauthorized" };
	}

	const user = await User.findById(decoded.uid);
	if (!user) throw { code: 401, message: "Unauthorized" };

	const accessToken = jwt.sign(
		{
			uid: user._id.toString(),
		} as IUserTokenMin,
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: ACCESS_TOKEN_EXP },
	);

	res.status(200).json({ token: accessToken, user: user.getUserBase() } as IAPIAccess);
};

export const postAuthLogout = async (req: Request, res: Response) => {
	res.status(200).json({});
};
