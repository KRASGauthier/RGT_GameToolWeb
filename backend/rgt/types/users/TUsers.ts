//This user interfaces is the complete user data containing all sensistive data and should not be used or send on front end
export interface IUserBackend {
	uid: string;
	username: string;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	refreshTokens: string[];
}
