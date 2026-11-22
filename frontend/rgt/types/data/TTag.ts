import type { TIconLibrary } from "../../../src/types/icons/TIconLibrary";
import type { TUID } from "../TShared";
import type { TColorEntry } from "../TStyles";

export interface ITag {
	uid: TUID;
	name: string;
	icon: TIconLibrary;
	color: TColorEntry;
}
