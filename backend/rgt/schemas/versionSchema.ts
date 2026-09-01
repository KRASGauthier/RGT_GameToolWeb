import { Schema } from "mongoose";
import { IVersion } from "../types/TShared.js";

export const versionSchema = new Schema<IVersion> (
	{
		major: {
			type: Number,
			default: 1,
			required: true,
			validate: {
				validator: Number.isInteger,
				message: "major should be an integer"
			}
		},
		minor: {
			type: Number,
			default: 0,
			required: true,
			validate: {
				validator: Number.isInteger,
				message: "major should be an integer"
			}
		},
		patch: {
			type: Number,
			default: 0,
			required: true,
			validate: {
				validator: Number.isInteger,
				message: "major should be an integer"
			}
		}
	},
	{
		_id: false,
	}
)