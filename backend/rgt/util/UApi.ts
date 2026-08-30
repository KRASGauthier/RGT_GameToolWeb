import { TAPIChecker } from "../types/api/TAPI.js";

export function checkApiSub(data: Record<string, unknown>, checker: TAPIChecker) {
	for (const [key] of Object.entries(data)) {
		if (!(key in checker))
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Unexpected field: ${key}`,
			};
	}

	for (const [key, value] of Object.entries(checker)) {
		if (!(key in data)) {
			if (value) continue;
			throw { code: 400, message: "Contract missmatch", log: `Missing field: ${key}` };
		}

		if (value.type != "checker" && typeof data[key] != value.type)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (got: ${typeof data[key]}, expected: ${value.type})`,
			};

		if (value.type == "checker" && value.checker && typeof data[key] == "object" && data[key] != null)
			checkApiSub(data[key] as Record<string, unknown>, value.checker);
	}
}

export function checkApi<_T>(data: Record<string, unknown>, checker: TAPIChecker): _T {
	checkApiSub(data, checker);
	return data as _T;
}
