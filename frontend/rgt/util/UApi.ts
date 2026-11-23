import type { TAPIChecker } from "../types/api/TAPI";

export function apiMakePartial(checker: TAPIChecker, omits: string[]) {
	const out: TAPIChecker = {};

	for (const [key, value] of Object.entries(checker)) {
		if (omits.includes(key)) continue;
		out[key] = structuredClone(value);
		out[key].optional = true;
	}

	return out;
}
