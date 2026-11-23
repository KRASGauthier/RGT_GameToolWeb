import { Model, Schema, Types } from "mongoose";
import { ITag } from "../../../../rgt/types/data/TTag.js";
import { IDBData } from "../../../../rgt/types/db/TDBTypes.js";
import { TAG_MAX_LEN } from "../../../../rgt/consts.js";
import { DIconLibrary, TIconLibrary } from "../../../types/icons/TIconLibrary.js";
import { cehckerIsColorEntry } from "../../../../rgt/util/UCheckers.js";
import { getDefaultSchema } from "../../../../rgt/util/USchema.js";
import { TColorEntry } from "../../../../rgt/types/TStyles.js";
import { appDB } from "../../../../rgt/middleware/db.js";

export interface ITagDB extends Omit<ITag, "uid">, IDBData {
	project: Types.ObjectId;
}

export interface ITagDBMethods {
	getData(): Promise<ITag>;
}

export const tagCurrentVersion: number = 0;

const tagSchema = new Schema<ITagDB, Model<ITagDB>, ITagDBMethods>(
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
			maxLength: TAG_MAX_LEN,
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
		...getDefaultSchema(tagCurrentVersion),
	},
	{
		timestamps: true,
	},
);

tagSchema.method("getData", async function (): Promise<ITag> {
	return {
		uid: this._id.toString(),
		name: this.name,
		icon: this.icon as TIconLibrary,
		color: this.color as TColorEntry,
	};
});

export const MTag = appDB.main.model("tag", tagSchema);
