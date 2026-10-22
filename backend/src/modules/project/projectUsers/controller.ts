import { IProjectUser } from "../../../types/data/project/TProjectUser.js";
import { MProjectUser } from "./schema.js";

export const projectUserCreate = async (user: string, project: string): Promise<IProjectUser> => {
	const nUser = await MProjectUser.create({
		user: user,
		project: project
	})
	
	return await nUser.getData()
}