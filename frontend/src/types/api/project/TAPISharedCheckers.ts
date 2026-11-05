import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";

//--------------------------------------------------
//                     OPTIONS
//--------------------------------------------------
export const KProjectChecker: TAPIChecker = {
	owner: {
		type: "string",
	},
	uid: {
		type: "string",
	},
	name: {
		type: "string",
	},
	title: {
		type: "string",
		optional: true,
	},
	cover: {
		type: "string",
		optional: true,
	},
	users: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	version: {
		type: "checker",
		checker: {
			major: {
				type: "number",
			},
			minor: {
				type: "number",
			},
			patch: {
				type: "number",
			},
		},
	},
	engine: {
		type: "string",
	},
	language: {
		type: "string",
	},
	created: {
		type: "string",
	},
	lastOpened: {
		type: "string",
		optional: true,
	},
};

export const KProjectUserChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	username: {
		type: "string",
	},
	avatar: {
		type: "string",
		optional: true,
	},
	initials: {
		type: "string",
		optional: true,
	},
	project: {
		type: "string",
	},
	groups: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	isOwner: {
		type: "boolean",
	},
};

export const KGroupChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	name: {
		type: "string",
	},
	icon: {
		type: "string",
	},
	color: {
		type: "string",
	},
	count: {
		type: "number",
		optional: true,
	},
};


//--------------------------------------------------
//                   PROJECT
//--------------------------------------------------
export const KTodoChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	name: {
		type: "string",
	},
	desc: {
		type: "string",
	},
	date: {
		type: "date",
	},
	users: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	groups: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	importance: {
		type: "number",
	},
	difficulty: {
		type: "number",
	},
	new: {
		type: "boolean",
		optional: true,
	},
};