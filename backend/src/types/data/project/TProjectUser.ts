import type { IUserBase } from "../../../../rgt/types/data/TUser.js";
import type { TUID } from "../../../../rgt/types/TShared.js";

export interface IProjectUser extends IUserBase {
	project: TUID
	groups: TUID[]
	isOwner: boolean
}