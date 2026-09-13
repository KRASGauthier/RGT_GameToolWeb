import { HydratedDocument } from "mongoose";
import { IProjectDB, IProjectDBMethods } from "../../modules/project/project/schema.ts";

declare global {
	namespace Express {
		export interface Request {
			project?: HydratedDocument<IProjectDB, IProjectDBMethods>;
		}
	}
}

export {};
