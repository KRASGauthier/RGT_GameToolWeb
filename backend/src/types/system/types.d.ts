import { HydratedDocument } from "mongoose";
import { IProjectDB, IProjectDBMethods } from "../../modules/project/schema.ts";
import { IGroupDB, IGroupDBMethods } from "../../modules/project/groups/schema.ts";

declare global {
	namespace Express {
		export interface Request {
			project?: HydratedDocument<IProjectDB, IProjectDBMethods>;
			group?: HydratedDocument<IGroupDB, IGroupDBMethods>;
		}
	}
}

export {};
