export type TProjectEngineTypes = "unrealEngine" | "godot";
export type TProjectLanguageTypes = "cpp" | "cs" | "gdscript";

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
