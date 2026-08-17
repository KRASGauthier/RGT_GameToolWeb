//--------------------------------------------------
//                    SEND

import type { IUserBase } from "../../data/TUser";

//--------------------------------------------------
export interface IAPIAuthLogin {
	email: string;
	password: string;
}

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIAccess {
	token: string;
	user: IUserBase;
}
