import type { Request, Response } from "express";
import { hasProject } from "../../../util/UError.js";
import { MTodo } from "./schema.js";
import { IAPITodo, IAPITodoDefault, IAPITodoDefaultChecker, IAPITodos } from "../../../types/api/project/TAPITodo.js";
import { ITodo } from "../../../types/data/project/TTodo.js";
import { checkApi } from "../../../../rgt/util/UApi.js";

//--------------------------------------------------
//                     ACCESS
//--------------------------------------------------
export const todoGet = async (req: Request, res: Response) => {
	hasProject(req);
	const todos = await MTodo.find({project: req.project._id});
	res.status(200).json({
		todos: todos.map((todo) => {
			return todo.toJSON<ITodo>();
		})
	} as IAPITodos)
}

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const todoCreate = async (req: Request, res: Response) => {
	hasProject(req);
	checkApi<IAPITodoDefault>(req.body, IAPITodoDefaultChecker);
	const todo =  await MTodo.create({
		project: req.project._id.toString()
	});

	res.status(201).json({
		todo: todo.toJSON<ITodo>()
	} as IAPITodo)
}