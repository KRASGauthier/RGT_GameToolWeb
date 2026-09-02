import type { IUserFull, IUserRegister } from "../../data/TUser";
import type { TAPIChecker } from "../TAPI";

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
export const IAPIUserPatchSelfChecker: TAPIChecker = {
	firstName: { type: "string", optional: true },
	lastName: { type: "string", optional: true },
	username: { type: "string", optional: true },
	email: { type: "string", optional: true },
};

export interface IAPIChangePassword {
	currentPassword: string;
	newPassword: string;
}
export const IAPIChangePasswordChecker: TAPIChecker = {
	currentPassword: { type: "string" },
	newPassword: { type: "string"},
};

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIUserCheckAvailableRcv {
	available: boolean;
}

export interface IAPIUserGetSelfFull {
	user: IUserFull;
}
