import { Model, Schema, Types } from "mongoose";
import { IDBData } from "../../../../rgt/types/db/TDBTypes.js";
import { ITodo } from "../../../types/data/project/TTodo.js";
import { getDefaultSchema } from "../../../../rgt/util/USchema.js";
import { appDB } from "../../../../rgt/middleware/db.js";
import { TIME_1D } from "../../../../rgt/consts.js";

export interface ITodoDB extends Omit<ITodo, "uid" | "project" | "users" | "date">, IDBData {
	users: Types.ObjectId[];
	project: Types.ObjectId
	date: Date;
}
export interface ITodoDBMethods {}
export const todoCurrentVersion: number = 0

const todoSchema = new Schema<ITodoDB, Model<ITodoDB>, ITodoDBMethods>(
	{
		users: {
			type: [{
				type: Schema.Types.ObjectId,
				ref: "user",
			}],
			required: true,
			default: [],
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "project",
			required: true
		},
		name: {
			type: String,
			required: true,
			trim: true,
			default:  "New todo"
		},
		desc: {
			type: String,
			default: "",
		},
		date: {
			type: Date,
			required: true,
			default: () => new Date(Date.now() + TIME_1D),
		},
		tags: {
			type: [String],
			default: [],
			required: true
		},
		importance: {
			type: Number,
			min: 0,
			max: 4,
			default: 2,
			required: true,
		},
		difficulty: {
			type: Number,
			min: 0,
			max: 4,
			default: 2,
			required: true,
		},
		...getDefaultSchema(todoCurrentVersion),
	},
	{
		timestamps: true,
	},
);

todoSchema.set("toJSON", {
	transform: (_doc, ret) => ({
		uid: ret._id.toString(),

		users: ret.users.map((user) => user.toString()),
		project: ret.project.toString(),

		name: ret.name,
		desc: ret.desc,
		date: ret.date.toISOString(),

		tags: ret.tags,
		importance: ret.importance,
		difficulty: ret.difficulty,
	}),
});

export const MTodo = appDB.main.model("todo", todoSchema);