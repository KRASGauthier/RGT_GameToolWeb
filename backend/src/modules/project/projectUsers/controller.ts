import type { Request, Response } from "express";
import { IProjectUser } from "../../../types/data/project/TProjectUser.js";
import { hasProject, hasProjectUser } from "../../../util/UError.js";
import { MProjectUser } from "./schema.js";
import { IAPIProjectUserAdd, IAPIProjectUserAddChecker, IAPIProjectUserChangeGroup, IAPIProjectUserChangeGroupChecker, IAPIProjectUserRcv, IAPIProjectUsersUpdate } from "../../../types/api/project/TAPIProjectUser.js";
import { checkApi } from "../../../../rgt/util/UApi.js";
import { projectHelperGetUsers } from "../controller.js";
import { User } from "../../../../rgt/modules/users/schema.js";
import { Types } from "mongoose";


//--------------------------------------------------
//                    HELPERS
//--------------------------------------------------
export const projectUserCreate = async (user: string, project: string): Promise<IProjectUser> => {

	if(!(await User.exists({_id: user})))
		throw {code: 404, message: "User not found", log: `Cannot find '${user}'`}

	const nUser = await MProjectUser.create({
		user: user,
		project: project
	})
	
	return await nUser.getData()
}


//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const projectUserAdd = async (req: Request, res: Response) => {
	hasProject(req);
	const data =  checkApi<IAPIProjectUserAdd>(req.body, IAPIProjectUserAddChecker);

	await projectUserCreate(data.user, req.project._id.toString())

	req.project.users.push(new Types.ObjectId(data.user))
	await req.project.save();

	//USERS
	const users = await projectHelperGetUsers(req);

	res.status(200).json({
		project: await req.project.getProjectFull(),
		users,
	} as IAPIProjectUsersUpdate);

}

export const projectUserDelete = async (req: Request, res: Response) => {
	hasProject(req);
	hasProjectUser(req);

	const userIndex: number = req.project.users.findIndex((user) => user.equals(req.projectUser.user))
	if(userIndex == -1)
		throw {code: 404, message: "User not found", log: `User ${req.projectUser.user.toString()} is not in the user list`}

	await req.projectUser.deleteOne();

	req.project.users.splice(userIndex, 1)
	await req.project.save();

	//USERS
	const users = await projectHelperGetUsers(req);

	res.status(200).json({
		project: await req.project.getProjectFull(),
		users,
	} as IAPIProjectUsersUpdate);

}

export const projectUserChangeGroup = async (req: Request, res: Response) => {
	hasProject(req);
	hasProjectUser(req);
	const data =  checkApi<IAPIProjectUserChangeGroup>(req.body, IAPIProjectUserChangeGroupChecker);
	req.projectUser.set({
		groups: data.groups
	})
	await req.projectUser.save();

	res.status(201).json({
		projectUser: await req.projectUser.getData()
	} as IAPIProjectUserRcv);
};
