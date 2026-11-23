import type { NextFunction, Request, Response } from "express";
import { hasProject } from "../../../util/UError.js";
import { MTodo } from "./schema.js";

export const verifyTodo = async (req: Request, res: Response, next: NextFunction) => {
	hasProject(req);
	if (!req.params.todo) throw { code: 400, message: "Missing todo UID" };
	const todo = await MTodo.findOne({ _id: req.params.todo, project: req.project._id });
	if (!todo) throw { code: 404, message: "Todo not found" };
	req.todo = todo;
	next();
};
