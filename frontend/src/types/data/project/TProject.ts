import type { IVersion } from "../../../../rgt/types/TShared";

export const TProjectEngineTypesConsts = ["unrealEngine", "godot"] as const
export type TProjectEngineTypes = typeof TProjectEngineTypesConsts[number];
export const TProjectLanguageTypesConsts = ["cpp", "cs", "gdscript"] as const
export type TProjectLanguageTypes = typeof TProjectLanguageTypesConsts[number];


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
};


//--------------------------------------------------
//                       DATA
//--------------------------------------------------
export interface IProject {
	owner: string;
	uid: string;
	name: string;
	title?: string;
	version: IVersion;

	engine: TProjectEngineTypes;
	language: TProjectLanguageTypes;
}