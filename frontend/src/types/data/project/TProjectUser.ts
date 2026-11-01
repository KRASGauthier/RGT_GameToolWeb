import type { IUserBase } from "../../../../rgt/types/data/TUser";
import type { TUID } from "../../../../rgt/types/TShared";

export interface IProjectUser extends IUserBase {
	project: TUID;
	groups: TUID[];
	isOwner: boolean;
}
