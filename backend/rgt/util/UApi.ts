import { IAPICheckInfo, TAPIChecker, TAPICheckInfoTypes } from "../types/api/TAPI.js";

function checkApiType(key: string, data: Record<string, unknown>, info: IAPICheckInfo) {
	if (!(key in data) && !info.optional)
		throw {
			code: 400,
			message: "Contract missmatch",
			log: `Missing field: ${key}`,
		};
	if (!(key in data) && info.optional) return;
	if (Array.isArray(data[key]))
		throw {
			code: 400,
			message: "Contract missmatch",
			log: `Unexpected array at key: ${key}`,
		};
	else if (info.type != "checker" && info.type != "date" && typeof data[key] != info.type)
		throw {
			code: 400,
			message: "Contract missmatch",
			log: `Wrong field type: ${key} (got: ${typeof data[key]}, expected: ${info.type})`,
		};
	else if (info.type == "date") {
		if (typeof data[key] == "string" && Number.isNaN(new Date(data[key]).getTime()))
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong date enry: '${data[key]}'`,
			};
		else if (
			(typeof data[key] == "object" && !(data[key] instanceof Date)) ||
			(typeof data[key] != "object" && typeof data[key] != "string") ||
			(data[key] instanceof Date && Number.isNaN(new Date(data[key]).getTime()))
		)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (got: ${typeof data[key]}(not a date), expected: Date)`,
			};

		if (typeof data[key] == "string") data[key] = new Date(data[key]);
	}
}
function checkApiTypeArray(value: unknown, type: TAPICheckInfoTypes, index: number, key: string) {
	if (Array.isArray(value))
		throw {
			code: 400,
			message: "Contract missmatch",
			log: `Unexpected array at index: ${index}`,
		};
	else if (type != "checker" && type != "date" && typeof value != type)
		throw {
			code: 400,
			message: "Contract missmatch",
			log: `Wrong field type  at ${index} for ${key} (got: ${typeof value}, expected: ${type})`,
		};
	else if (type == "date") {
		if (typeof value == "string" && Number.isNaN(new Date(value).getTime()))
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong date enty: '${value}'`,
			};
		else if (
			(typeof value == "object" && !(value instanceof Date)) ||
			(typeof value != "object" && typeof value != "string") ||
			(value instanceof Date && Number.isNaN(new Date(value).getTime()))
		)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type at ${index} for ${key} (got: ${typeof value}(not a date), expected: Date)`,
			};
	}
}
export function checkApi<_T>(data: Record<string, unknown>, checker: TAPIChecker): _T {
	for (const [key] of Object.entries(data)) {
		if (!(key in checker))
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Unexpected field: ${key}`,
			};
	}

	for (const [key, value] of Object.entries(checker)) {
		if (value.isArray && Array.isArray(data[key])) {
			for (const [index, subValue] of data[key].entries()) {
				if (
					value.type == "checker" &&
					value.checker &&
					typeof subValue == "object" &&
					subValue != null &&
					!Array.isArray(subValue)
				)
					checkApi(subValue, value.checker);
				else if (value.type == "checker")
					throw {
						code: 400,
						message: "Contract missmatch",
						log: `Wrong field type at ${index} for ${key} (expected: object)`,
					};
				else checkApiTypeArray(subValue, value.type, index, key);
			}
		} else if (
			value.isArray &&
			!Array.isArray(data[key]) &&
			!(data[key] == undefined && value.optional)
		)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (got: ${typeof data[key]}, expected: Array)`,
			};
		else if (
			value.type == "checker" &&
			value.checker &&
			typeof data[key] == "object" &&
			data[key] != null &&
			!Array.isArray(data[key])
		) {
			checkApi(data[key] as Record<string, unknown>, value.checker);
		} else if (value.type == "checker" && key in data)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (expected: object)`,
			};
		else checkApiType(key, data, value);
	}

	return data as _T;
}

export function apiMakePartial(checker: TAPIChecker, omits: string[]) {
	const out: TAPIChecker = {};

	for (const [key, value] of Object.entries(checker)) {
		if (omits.includes(key)) continue;
		out[key] = structuredClone(value);
		out[key].optional = true;
	}

	return out;
}
