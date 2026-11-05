import type { TUID } from "../../../../rgt/types/TShared.js";

export interface ITodo {
	uid: TUID;
	project: TUID;
	
	name: string;
	desc: string;
	date: Date;

	users: TUID[];
	groups: TUID[];

	importance: number;
	difficulty: number;

	new?: boolean
}

