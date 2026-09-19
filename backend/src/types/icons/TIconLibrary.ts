export const DIconLibrary = [
	"home",
	"project",
	"todo",
	"bugs",
	"roadmap",
	"settings",
	"options",
	"users",
	"groups",
	"add",
	"edit",
	"delete",
	"tick",
	"clear",
] as const;

export type TIconLibrary = (typeof DIconLibrary)[number];
