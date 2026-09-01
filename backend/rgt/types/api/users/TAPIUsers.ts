import type { IUserFull, IUserRegister } from "../../data/TUser.js";
import type { TAPIChecker } from "../TAPI.js";

//--------------------------------------------------
//                    SEND
//--------------------------------------------------
export interface IAPIUserRegister {
	user: IUserRegister;
}

export interface IAPIUserCheckAvailable {
	username: string;
}

export type IAPIUserPatchSelf = Partial<
	Pick<IUserFull, "firstName" | "lastName" | "username" | "email">
>;

export interface IAPIChangePassword {
	currentPassword: string;
	newPassword: string;
}

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIUserCheckAvailableRcv {
	available: boolean;
}

export interface IAPIUserGetSelfFull {
	user: IUserFull;
}

export const API_USER_PATCH_SELF_CHECKER = {
	firstName: { type: "string" as const, optional: true as const },
	lastName: { type: "string" as const, optional: true as const },
	username: { type: "string" as const, optional: true as const },
	email: { type: "string" as const, optional: true as const },
} as const;

export const API_CHANGE_PASSWORD_CHECKER = {
	currentPassword: { type: "string" as const },
	newPassword: { type: "string" as const },
} as TAPIChecker;