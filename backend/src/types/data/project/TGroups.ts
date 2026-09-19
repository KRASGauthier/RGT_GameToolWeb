import type { TColorEntry } from "../../../../rgt/types/TStyles.js";
import type { TIconLibrary } from "../../icons/TIconLibrary.js";

export interface IGroup {
	uid: string;
	name: string;
	icon: TIconLibrary;
	color: TColorEntry;
	count?: number;
}
