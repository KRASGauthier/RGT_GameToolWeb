import type { Request, Response } from "express";
import { hasProject } from "../../../util/UError.js";
import { hasUser } from "../../../../rgt/util/UError.js";
import { MTodo } from "./schema.js";
import { TIME_1D } from "../../../../rgt/consts.js";
import { IAPITodoRcvAll } from "../../../types/api/project/TAPITodos.js";
import { ITodo } from "../../../types/data/project/TTodo.js";

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const todoCreate = async (req: Request, res: Response) => {
	hasUser(req);
	hasProject(req)

	const todo = await MTodo.create({
		project: req.project._id,
		name: "New Task",
		date: new Date(Date.now() + TIME_1D)
	});

	const todos: ITodo[] = await Promise.all((
		await MTodo.find({project: req.project._id})
	).map((todo) => {
		return todo.getData()
	}))

	const current: ITodo | undefined = todos.find((check: ITodo) => check.uid == todo._id.toString())
	if(current)
		current.new = true;

	res.status(201).json({ 
		todos
	} as IAPITodoRcvAll);
};