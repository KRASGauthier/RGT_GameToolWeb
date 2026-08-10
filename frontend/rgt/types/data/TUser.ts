//--------------------------------------------------
//                      HOLDERS
//--------------------------------------------------
export interface IUserBase {
	username: string;
	avatar?: string;
}

export interface IUserFull extends IUserBase {
	email: string;
	firstName?: string;
	lastName?: string;
}

export interface IUserRegister extends IUserFull {
	password: string;
}
