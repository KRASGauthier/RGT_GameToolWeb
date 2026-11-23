import { HydratedDocument } from "mongoose";
import { IProjectDB, IProjectDBMethods } from "../../modules/project/schema.ts";
import { IGroupDB, IGroupDBMethods } from "../../modules/project/groups/schema.ts";
import {
	IProjectUserDB,
	IProjectUserDBMethods,
} from "../../modules/project/projectUsers/schema.ts";
import { ITagDB, ITagDBMethods } from "../../modules/project/tags/schema.ts";
import { ITodoDB, ITodoDBMethods } from "../../modules/project/todo/schema.ts";

declare global {
	namespace Express {
		export interface Request {
			tag?: HydratedDocument<ITagDB, ITagDBMethods>;

			project?: HydratedDocument<IProjectDB, IProjectDBMethods>;
			group?: HydratedDocument<IGroupDB, IGroupDBMethods>;
			projectUser?: HydratedDocument<IProjectUserDB, IProjectUserDBMethods>;

			todo?: HydratedDocument<ITodoDB, ITodoDBMethods>;
		}
	}
}

export {};
