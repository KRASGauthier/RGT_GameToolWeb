import { Model, Schema } from "mongoose";
import { IDBData } from "../../types/db/TDBTypes.js";
import { IUserBackend } from "../../types/users/TUsers.js";
import { appDB } from "../../middleware/db.js";
import { getDefaultSchema } from "../../util/USchema.js";
import {
	AUTH_FIRST_NAME_MAX,
	AUTH_LAST_NAME_MAX,
	AUTH_MAX_USER,
	AUTH_MIN_USER,
	AUTH_USER_MULTI_LANG,
} from "../../../src/consts.js";
import { IUserBase, IUserFull } from "../../types/data/TUser.js";

export interface IUserBackendDB extends Omit<IUserBackend, "uid">, IDBData {}
export interface IUserBackendDBMethods {
	getUserBase(): IUserBase;
	getUserFull(): IUserFull;
}
export const userCurrentVersion: number = 0;

const userSchema = new Schema<IUserBackendDB, Model<IUserBackendDB>, IUserBackendDBMethods>(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			minLength: AUTH_MIN_USER,
			maxLength: AUTH_MAX_USER,
			match: [
				AUTH_USER_MULTI_LANG ? /^[\p{L}\p{M}\p{N}_]+$/u : /^[A-Za-z0-9_]+$/,
				"unallowed characters",
			],
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email format"],
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		firstName: {
			type: String,
			trim: true,
			maxLength: AUTH_FIRST_NAME_MAX,
		},
		lastName: {
			type: String,
			trim: true,
			maxLength: AUTH_LAST_NAME_MAX,
		},
		avatar: {
			type: String,
		},
		refreshTokens: {
			type: [String],
			defaul: [],
		},
		...getDefaultSchema(userCurrentVersion),
	},
	{
		timestamps: true,
	},
);
userSchema.set("toJSON", {
	transform: (_doc, ret) => ({
		uid: ret._id.toString(),
		username: ret.username,
		email: ret.email,
		password: ret.password,
		firstName: ret.firstName ? ret.firstName : undefined,
		lastName: ret.lastName ? ret.lastName : undefined,
		avatar: ret.avatar ? ret.avatar : undefined,
		refreshTokens: ret.refreshTokens,
	}),
});

userSchema.method("getUserBase", function (): IUserBase {
	let initials: string = "";
	if (this.firstName) initials += this.firstName.charAt(0).toUpperCase();
	if (this.lastName) initials += this.lastName.charAt(0).toUpperCase();
	if (!initials) initials = this.username.charAt(0).toUpperCase();

	return {
		uid: this._id.toString(),
		username: this.username,
		avatar: this.avatar,
		initials: initials,
	};
});

userSchema.method("getUserFull", function (): IUserFull {
	return {
		uid: this._id.toString(),
		username: this.username,
		email: this.email,
		firstName: this.firstName ? this.firstName : undefined,
		lastName: this.lastName ? this.lastName : undefined,
		avatar: this.avatar ? this.avatar : undefined,
	};
});

export const User = appDB.users.model("user", userSchema);
