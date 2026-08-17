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

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIUserCheckAvailableRcv {
	available: boolean;
}

export interface IAPIUserGetSelfFull {
	user: IUserFull;
}
