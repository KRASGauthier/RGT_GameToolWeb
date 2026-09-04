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

	Object.entries(checker).forEach(([key, value]) => {
		if (!(key in data) && !value.optional)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Missing field: ${key}`,
			};

		if (!(key in data) && value.optional) return;

		if (value.type != "checker" && value.type != "array" && typeof data[key] != value.type)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (got: ${typeof data[key]}, expected: ${value.type})`,
			};

		if (value.type == "array" && !Array.isArray(data[key]))
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (got: ${typeof data[key]}, expected: array)`,
			};

		if (value.type == "checker" && value.checker)
			checkApiSub(data[key] as Record<string, unknown>, value.checker);
	});
}

export function checkApi<_T>(data: Record<string, unknown>, checker: TAPIChecker): _T {
	checkApiSub(data, checker);
	return data as _T;
}
