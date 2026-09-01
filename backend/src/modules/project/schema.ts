import { Schema, Types } from "mongoose";
import { IDBData } from "../../../rgt/types/db/TDBTypes.js";
import { IProject, TProjectEngineTypesConsts, TProjectLanguageTypesConsts } from "../../types/data/project/TProject.js";
import { PROJECT_GAME_NAME_MAX, PROJECT_NAME_MAX, PROJECT_NAME_MIN } from "../../consts.js";
import { versionSchema } from "../../../rgt/schemas/versionSchema.js";
import { appDB } from "../../../rgt/middleware/db.js";

export interface IProjectDB extends Omit<IProject, "uid" | "owner">, IDBData {
	owner: Types.ObjectId
}
export const projectCurrentVersion: number = 0;



const projectSchema = new Schema<IProjectDB>(
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
			maxLength: PROJECT_NAME_MAX
		},
		title: {
			type: String,
			default: "",
			maxLength: PROJECT_GAME_NAME_MAX
		},
		version: {
			type: versionSchema,
			required: true,
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
		}
	}
)

projectSchema.set("toJSON", {
	transform: (_doc, ret) => ({
		owner: ret.owner.toString(),
		uid: ret._id.toString(),
		name: ret.name,
		title: ret.title,
		version: ret.version,
	
		engine: ret.engine,
		language: ret.language,
	})
});

export const MProject = appDB.main.model("project", projectSchema);