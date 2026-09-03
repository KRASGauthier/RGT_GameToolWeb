import { TAPIChecker } from "../types/api/TAPI.js";

export function checkApiSub(data: Record<string, unknown>, checker: TAPIChecker) {
	Object.entries(checker).forEach(([key, value]) => {
		if (!(key in data)) {
			if (!value.optional)
				throw { code: 400, message: "Contract missmatch", log: `Missing field: ${key}` };
		} else if (value.type != "checker" && typeof data[key] != value.type)
			throw {
				code: 400,
				message: "Contract missmatch",
				log: `Wrong field type: ${key} (got: ${typeof data[key]}, expected: ${value.type})`,
			};
		else if (value.type == "checker" && value.checker)
			checkApiSub(data[key] as Record<string, unknown>, value.checker);
	});
}

export function checkApi<_T>(data: Record<string, unknown>, checker: TAPIChecker): _T {
	checkApiSub(data, checker);
	return data as _T;
}
