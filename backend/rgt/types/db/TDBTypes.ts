import { Types } from "mongoose";

export interface IDBData {
	_id: Types.ObjectId;
	schemaVersion: number;
	globalVersion: number;
}
