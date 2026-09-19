import type { TColorEntry } from "../../../../rgt/types/TStyles";
import type { TIconLibrary } from "../../icons/TIconLibrary";

export interface IGroup {
	uid: string;
	name: string;
	icon: TIconLibrary;
	color: TColorEntry;
	count?: number;
}
