//--------------------------------------------------
//                      HOLDERS
//--------------------------------------------------
export interface IUserBase {
	uid: string;
	username: string;
	avatar?: string;
	initials?: string;
}

export interface IUserTokenMin {
	uid: string;
}

export interface IUserFull extends IUserBase {
	email: string;
	firstName?: string;
	lastName?: string;
}

export interface IUserRegister extends IUserFull {
	password: string;
}
