import type { IUserRegister } from "../../data/TUser.js";

//--------------------------------------------------
//                    SEND
//--------------------------------------------------
export interface IAPIUserRegister {
	user: IUserRegister;
}

export interface IAPIUserCheckAvailable {
	username: string;
}

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIUserCheckAvailableRcv {
	available: boolean;
}
