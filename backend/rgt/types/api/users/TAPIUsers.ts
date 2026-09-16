import type { IUserBase, IUserFull, IUserRegister } from "../../data/TUser.js";
import type { TAPIChecker } from "../TAPI.js";

//--------------------------------------------------
//                    SEND
//--------------------------------------------------
//ACCESS
export interface IAPIUserSearch {
	search: string;
}
export const IAPIUserSearchChecker: TAPIChecker = {
	search: { type: "string" },
};

export interface IAPIUserCheckAvailable {
	username: string;
}

//MANAGE
export interface IAPIUserRegister {
	user: IUserRegister;
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
	newPassword: { type: "string" },
};

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIUserCheckAvailableRcv {
	available: boolean;
}

export interface IAPIUserList {
	users: IUserBase[];
}
export const IAPIUserListChecker: TAPIChecker = {
	users: {
		type: "array",
		checker: {
			uid: {
				type: "string",
			},
			username: {
				type: "string",
			},
			avatar: {
				type: "string",
				optional: true,
			},
			initials: {
				type: "string",
				optional: true,
			},
		},
	},
};

export interface IAPIUserGetSelfFull {
	user: IUserFull;
}
