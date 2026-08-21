import type { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { checkField } from "../../util/UError.js";
import { User } from "../users/schema.js";
import { IAPIAuthLogin, IAPIAccess } from "../../types/api/auth/TAPIAuth.js";
import { IUserTokenMin } from "../../types/data/TUser.js";
import { TIME_1W } from "../../consts.js";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "../../../rgt/backendConsts.js";
import { mutexLock, TReleaseMutex } from "../../tools/mutex.js";

export const postAuth = async (req: Request, res: Response) => {
	checkField("email", req.body);
	checkField("password", req.body, "string");

	//Clean up
	const refreshToken: string | undefined = req.cookies.jwt;
	if (refreshToken && typeof refreshToken == "string") {
		await User.findOneAndUpdate(
			{ refreshTokens: refreshToken },
			{ $pull: { refreshTokens: refreshToken } },
		);
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
	}

	const body: IAPIAuthLogin = req.body as IAPIAuthLogin;

	const user = await User.findOne({ email: body.email });
	if (!user) throw { code: 401, message: "Can't login email or password is wrong" };

	const trimmedPWD: string = body.password.trim();
	if (!(await argon2.verify(user.password, trimmedPWD)))
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

	const newRefreshToken = jwt.sign(
		{
			uid: user._id.toString(),
		} as IUserTokenMin,
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: REFRESH_TOKEN_EXP },
	);

	user.refreshTokens.push(newRefreshToken);
	await user.save();

	res.cookie("jwt", newRefreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: TIME_1W,
	});

	res.status(200).json({ token: accessToken, user: user.getUserBase() } as IAPIAccess);
};

export const getAuthRefresh = async (req: Request, res: Response) => {
	const refreshToken: string | undefined = req.cookies.jwt;
	if (!refreshToken || typeof refreshToken != "string")
		throw { code: 401, message: "Unauthorized" };

	if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)
		throw { code: 500, message: "failed to start JWT" };
	let decoded: IUserTokenMin;
	try {
		decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as IUserTokenMin;
	} catch {
		await User.updateOne(
			{ refreshTokens: refreshToken },
			{ $pull: { refreshTokens: refreshToken } },
		);
		throw { code: 401, message: "Unauthorized" };
	}

	const release: TReleaseMutex = await mutexLock(decoded.uid);

	try {
		const user = await User.findById(decoded.uid);
		if (!user) throw { code: 401, message: "Unauthorized" };

		res.clearCookie("jwt", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		//Detect refresh token reuse
		if (!(await User.findOne({ _id: user._id, refreshTokens: refreshToken }))) {
			user.refreshTokens = [];
			await user.save();
			throw { code: 401, message: "Unauthorized" };
		}

		user.refreshTokens = user.refreshTokens.filter((rt: string) => rt != refreshToken);

		const accessToken = jwt.sign(
			{
				uid: user._id.toString(),
			} as IUserTokenMin,
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: ACCESS_TOKEN_EXP },
		);

		const newRefreshToken = jwt.sign(
			{
				uid: user._id.toString(),
			} as IUserTokenMin,
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: REFRESH_TOKEN_EXP },
		);

		res.cookie("jwt", newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: TIME_1W,
		});

		user.refreshTokens.push(newRefreshToken);

		await user.save();

		res.status(200).json({ token: accessToken, user: user.getUserBase() } as IAPIAccess);
	} finally {
		release();
	}
};

export const postAuthLogout = async (req: Request, res: Response) => {
	const refreshToken: string | undefined = req.cookies.jwt;
	if (!refreshToken) return res.status(204).json({});

	res.clearCookie("jwt", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});

	if (typeof refreshToken != "string") return res.status(204).json({});

	const user = await User.findOne({ refreshTokens: refreshToken });
	if (!user) return res.status(204).json({});

	user.refreshTokens = user.refreshTokens.filter((rt: string) => rt != refreshToken);
	await user.save();
	res.status(204).json({});
};
export const postAuthLogoutEverywhere = async (req: Request, res: Response) => {
	const refreshToken: string | undefined = req.cookies.jwt;
	if (!refreshToken || typeof refreshToken != "string") return res.status(204).json({});

	res.clearCookie("jwt", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});

	if (typeof refreshToken != "string") return res.status(204).json({});

	const user = await User.findOne({ refreshTokens: refreshToken });
	if (!user) return res.status(204).json({});

	user.refreshTokens = user.refreshTokens = [];
	await user.save();
	res.status(204).json({});
};
