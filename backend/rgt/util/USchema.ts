import { GLOBAL_SCHEMA_VERSION } from "../../src/backendConsts.js";

export const getDefaultSchema = (localVersion: number) => {
	return {
		schemaVersion: {
			type: Number,
			required: true,
			default: localVersion,
		},
		globalVersion: {
			type: Number,
			required: true,
			default: GLOBAL_SCHEMA_VERSION,
		},
	};
};
