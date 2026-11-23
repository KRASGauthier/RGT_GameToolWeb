import type { TUID } from "../../../../rgt/types/TShared";

export type TTodoState = "current" | "done" | "canceled";
export interface ITodo {
	uid: TUID;
	project: TUID;

	name: string;
	desc: string;
	date: Date;

	users: TUID[];
	groups: TUID[];
	tags: TUID[];

	importance: number;
	difficulty: number;

	state: TTodoState;
	new?: boolean;
}
