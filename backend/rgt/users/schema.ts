import { Schema } from "mongoose";
import { IDBData } from "../types/db/TDBTypes.js";
import { IUserBackend } from "../types/users/TUsers.js";
import { appDB } from "../middleware/db.js";
import { getDefaultSchema } from "../util/USchema.js";

export interface IUserBackendDB extends Omit<IUserBackend, "uid">, IDBData {}
export const userCurrentVersion: number = 0;

const userSchema = new Schema<IUserBackendDB>(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		avatar: {
			type: String,
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
	}),
});

export const User = appDB.users.model<IUserBackendDB>("user", userSchema);
