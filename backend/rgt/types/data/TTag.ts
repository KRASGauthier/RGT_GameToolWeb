import type { TIconLibrary } from "../../../src/types/icons/TIconLibrary.js";
import type { TUID } from "../TShared.js";
import type { TColorEntry } from "../TStyles.js";

export interface ITag {
	uid: TUID;
	name: string;
	icon: TIconLibrary;
	color: TColorEntry;
}
