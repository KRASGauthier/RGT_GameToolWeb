import { Model, Schema, Types } from "mongoose";
import { ITodo } from "../../../types/data/project/TTodo.js";
import { getDefaultSchema } from "../../../../rgt/util/USchema.js";
import { appDB } from "../../../../rgt/middleware/db.js";

export interface ITodoDB extends Omit<ITodo, "uid" | "users" | "groups" |  "new" | "project"> {
	project: Types.ObjectId;
	users: Types.ObjectId[];
	groups: Types.ObjectId[];
}

export interface IToodoDBMethods {
	getData(): Promise<ITodo>;
}
export const todoCurrentVersion: number = 0;

const todoSchema = new Schema<ITodoDB, Model<ITodoDB>, IToodoDBMethods>(
	{
		project: {
			type: Schema.Types.ObjectId,
			ref: "project",
			required: true
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		desc: {
			type: String,
			default: "",
		},
		date: {
			type: Date,
			required: true,
		},
		users: {
			type: [Schema.Types.ObjectId],
			ref: "projectUser",
			default: [],
		},
		groups: {
			type: [Schema.Types.ObjectId],
			ref: "group",
			default: [],
		},
		importance: {
			type: Number,
			default: 2,
			min: 0,
			max: 4
		},
		difficulty: {
			type: Number,
			default: 2,
			min: 0,
			max: 4
		},
		...getDefaultSchema(todoCurrentVersion),
	},
	{
		timestamps: true,
	},
)

todoSchema.method("getData", async function (): Promise<ITodo> {
	return {
		uid: this._id.toString(),
		project: this.project.toString(),
		name: this.name,
		desc: this.desc,
		date: this.date,
		users: this.users.map((user: Types.ObjectId): string => user.toString()),
		groups: this.groups.map((group: Types.ObjectId): string => group.toString()),
		importance: this.importance,
		difficulty: this.difficulty,
	};
});

export const MTodo = appDB.main.model("todo", todoSchema);