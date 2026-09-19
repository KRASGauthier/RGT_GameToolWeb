import { Model, Schema, Types } from "mongoose";
import { getDefaultSchema } from "../../../../rgt/util/USchema.js";
import { IDBData } from "../../../../rgt/types/db/TDBTypes.js";
import { IGroup } from "../../../types/data/project/TGroups.js";
import { appDB } from "../../../../rgt/middleware/db.js";
import { cehckerIsColorEntry } from "../../../../rgt/util/UCheckers.js";
import { DIconLibrary, TIconLibrary } from "../../../types/icons/TIconLibrary.js";
import { TColorEntry } from "../../../../rgt/types/TStyles.js";
import { PROJECT_GROUP_NAME_MAX } from "../../../consts.js";

export interface IGroupDB extends Omit<IGroup, "uid" | "icon" | "color" | "count">, IDBData {
	project: Types.ObjectId;
	icon: string;
	color: string;
}

export interface IGroupDBMethods {
	getJSON(): Promise<IGroup>;
}

export const groupCurrentVersion: number = 0;

const groupSchema = new Schema<IGroupDB, Model<IGroupDB>, IGroupDBMethods>(
	{
		project: {
			type: Schema.Types.ObjectId,
			ref: "project",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			maxLength: PROJECT_GROUP_NAME_MAX,
		},
		icon: {
			type: String,
			required: true,
			enum: DIconLibrary,
		},
		color: {
			type: String,
			required: true,
			validate: cehckerIsColorEntry,
		},
		...getDefaultSchema(groupCurrentVersion),
	},
	{
		timestamps: true,
	},
);

groupSchema.set("toJSON", {
	transform: (_doc, ret) => ({
		uid: ret._id.toString(),
		name: ret.name,
		icon: ret.icon,
		color: ret.color,
	}),
});

groupSchema.method("getJSON", async function (): Promise<IGroup> {
	return {
		uid: this._id.toString(),
		name: this.name,
		icon: this.icon as TIconLibrary,
		color: this.color as TColorEntry,
	};
});

export const MGroup = appDB.main.model("group", groupSchema);
