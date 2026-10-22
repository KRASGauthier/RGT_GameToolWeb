import { Model, Schema, Types } from "mongoose";
import { IDBData } from "../../../../rgt/types/db/TDBTypes.js";
import { IProjectUser } from "../../../types/data/project/TProjectUser.js";
import { getDefaultSchema } from "../../../../rgt/util/USchema.js";
import { User } from "../../../../rgt/modules/users/schema.js";
import { MProject } from "../schema.js";
import { appDB } from "../../../../rgt/middleware/db.js";

export interface IProjectUserDB
	extends Omit<IProjectUser, "uid" | "project" | "groups" | "username" >, IDBData {
	user: Types.ObjectId;
	project: Types.ObjectId;
	groups: Types.ObjectId[]
}

export interface IProjectUserDBMethods {
	getData(): Promise<IProjectUser>;
}

export const projectUserCurrentVersion: number = 0;

const projectUserSchema = new Schema<IProjectUserDB, Model<IProjectUserDB>, IProjectUserDBMethods>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "project",
			required: true,
		},
		groups: {
			type: [{ 
				type: Schema.Types.ObjectId, 
				ref: "group" 
			}],
    		default: [],
		},
		...getDefaultSchema(projectUserCurrentVersion),
	},
	{
		timestamps: true,
	},
)

projectUserSchema.index({ user: 1, project: 1 }, { unique: true });


projectUserSchema.method("getData", async function(): Promise<IProjectUser> {

	const user = await User.findById(this.user);
	if(!user)
		throw { code: "404", message: "User not found"}

	const project = await MProject.findById(this.project)
	if(!project)
		throw { code: "404", message: "Project not found"}



	return {
		...user.getUserBase(),
		project: this.project.toString(),
		groups: this.groups.map(group => group.toString()),
		isOwner: project.owner == user._id
	}
});


export const MProjectUser = appDB.main.model("projectUser", projectUserSchema);