import { Connection } from "mongoose";

export interface IDB {
	main: Connection;
	users: Connection;
}
