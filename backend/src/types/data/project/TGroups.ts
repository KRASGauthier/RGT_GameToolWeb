import type { TUID } from "../../../../rgt/types/TShared.js";
import type { TColorEntry } from "../../../../rgt/types/TStyles.js";
import type { TIconLibrary } from "../../icons/TIconLibrary.js";

export interface IGroup {
	uid: TUID;
	name: string;
	icon: TIconLibrary;
	color: TColorEntry;
	count?: number;
}
