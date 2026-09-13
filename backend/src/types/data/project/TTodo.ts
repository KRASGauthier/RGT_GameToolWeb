export interface ITodo {
	uid: string;
	project: string;
	users: string[];
	name: string;
	desc: string;
	date: Date | string;
	
	tags: string[];
	importance: number;
	difficulty: number;
}