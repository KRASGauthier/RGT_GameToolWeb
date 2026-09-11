import type { IVersion } from "../../../../rgt/types/TShared.js";

export const TProjectEngineTypesConsts = ["unrealEngine", "godot", "rgtSystem"] as const;
export type TProjectEngineTypes = (typeof TProjectEngineTypesConsts)[number];
export const TProjectLanguageTypesConsts = ["cpp", "cs", "gdscript", "ts"] as const;
export type TProjectLanguageTypes = (typeof TProjectLanguageTypesConsts)[number];

//--------------------------------------------------
//                   SETTINGS
//--------------------------------------------------
export interface TProjectLanguage {
	value: TProjectLanguageTypes;
	display: string;
}
export interface IProjectEngine {
	value: TProjectEngineTypes;
	display: string;

	langs: TProjectLanguage[];
}
export const DProjectLanguages: Record<TProjectLanguageTypes, TProjectLanguage> = {
	cpp: {
		value: "cpp",
		display: "C++",
	},
	cs: {
		value: "cs",
		display: "C#",
	},
	gdscript: {
		value: "gdscript",
		display: "GD Script",
	},
	ts: {
		value: "ts",
		display: "Typescript",
	},
};
export const DProjectEngine: Record<TProjectEngineTypes, IProjectEngine> = {
	unrealEngine: {
		value: "unrealEngine",
		display: "Unreal Engine",

		langs: [DProjectLanguages.cpp],
	},
	godot: {
		value: "godot",
		display: "Godot",

		langs: [DProjectLanguages.cs, DProjectLanguages.gdscript],
	},
	rgtSystem: {
		value: "rgtSystem",
		display: "RGT System",

		langs: [DProjectLanguages.ts],
	},
};

//--------------------------------------------------
//                       DATA
//--------------------------------------------------
export interface IProject {
	owner: string;
	ownerName?: string;
	uid: string;
	name: string;
	title?: string;
	cover?: string;
	version: IVersion;

	engine: TProjectEngineTypes;
	language: TProjectLanguageTypes;

	created: Date | string;
	lastOpened?: Date | string;
}
