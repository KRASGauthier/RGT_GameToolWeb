import mongoose, { Connection } from "mongoose";
import { IDB } from "../types/db/TDB.js";
import { uError, ulog } from "../util/ULog.js";

//DB CONNECTION
export const appDB: IDB  = {
	main: mongoose.createConnection(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo:27017/${process.env.DB_NAME}?authSource=admin`),
	users: mongoose.createConnection(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo:27017/${process.env.DB_USERS_NAME}?authSource=admin`)
}

export const checkMongoDB = () => {
	(Object.entries(appDB)  as [keyof IDB, Connection][]).forEach(([key, db]: [keyof IDB, Connection]) => {
		db.asPromise().then(() => {
			ulog("DB: Mongoose connected to the '" +  key + "' database")
		}).catch((error: unknown) => {
			uError("MongoDB connection failed:", error);
			process.exit(1);
		});
	});
}