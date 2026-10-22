import { Model, Schema, Types } from "mongoose";
import { IDBData } from "../../../rgt/types/db/TDBTypes.js";
import {
	IProject,
	TProjectEngineTypesConsts,
	TProjectLanguageTypesConsts,
} from "../../types/data/project/TProject.js";
import { PROJECT_GAME_NAME_MAX, PROJECT_NAME_MAX, PROJECT_NAME_MIN } from "../../consts.js";
import { versionSchema } from "../../../rgt/schemas/versionSchema.js";
import { appDB } from "../../../rgt/middleware/db.js";
import { getDefaultSchema } from "../../../rgt/util/USchema.js";

export interface IProjectDB
	extends Omit<IProject, "uid" | "owner" | "users" | "ownerName" | "created" | "lastOpened">, IDBData {
	owner: Types.ObjectId;
	users: Types.ObjectId[];

	createdAt: Date;
	updatedAt: Date;
}
export interface IProjectDBMethods {
	getProjectFull(): Promise<IProject>;
}
export const projectCurrentVersion: number = 0;

const projectSchema = new Schema<IProjectDB, Model<IProjectDB>, IProjectDBMethods>(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			minLength: PROJECT_NAME_MIN,
			maxLength: PROJECT_NAME_MAX,
		},
		title: {
			type: String,
			default: "",
			maxLength: PROJECT_GAME_NAME_MAX,
		},
		cover: String,
		version: {
			type: versionSchema,
			required: true,
		},
		users: {
			type: [{ 
				type: Schema.Types.ObjectId, 
				ref: "user" 
			}],
    		default: [],
		},
		engine: {
			type: String,
			enum: TProjectEngineTypesConsts,
			required: true,
		},
		language: {
			type: String,
			enum: TProjectLanguageTypesConsts,
			required: true,
		},
		...getDefaultSchema(projectCurrentVersion),
	},
	{
		timestamps: true,
	},
);

projectSchema.set("toJSON", {
	transform: (_doc, ret) => ({
		owner: ret.owner.toString(),
		uid: ret._id.toString(),
		name: ret.name,
		title: ret.title,
		cover: ret.cover,
		version: ret.version,

		users: ret.users.map((user) => user.toString()),

		engine: ret.engine,
		language: ret.language,

		created: ret.createdAt.toISOString(),
	}),
});

projectSchema.method("getProjectFull", async function (): Promise<IProject> {

	return {
		owner: this.owner.toString(),
		uid: this._id.toString(),
		name: this.name,
		title: this.title,
		cover: this.cover,
		version: this.version,

		users: this.users.map((user) => user.toString()),

		engine: this.engine,
		language: this.language,

		created: this.createdAt.toISOString(),
	};
});

export const MProject = appDB.main.model("project", projectSchema);
