import type { IUserFull, IUserRegister } from "../../data/TUser";

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
	firstName: { type: "string", optional: true },
	lastName: { type: "string", optional: true },
	username: { type: "string", optional: true },
	email: { type: "string", optional: true },
};