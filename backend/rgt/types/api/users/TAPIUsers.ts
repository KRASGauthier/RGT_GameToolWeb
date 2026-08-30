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
	firstName: { type: "string" as const, optional: true },
	lastName: { type: "string" as const, optional: true },
	username: { type: "string" as const, optional: true },
	email: { type: "string" as const, optional: true },
} as TAPIChecker;