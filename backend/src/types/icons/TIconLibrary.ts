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
	"search",
	"tick",
	"clear",
	"upArrow",
	"downArrow",
] as const;

export type TIconLibrary = (typeof DIconLibrary)[number];
