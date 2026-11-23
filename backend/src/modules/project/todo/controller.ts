import type { Request, Response } from "express";
import { hasProject, hasTodo } from "../../../util/UError.js";
import { MTodo } from "./schema.js";
import { TIME_1D } from "../../../../rgt/consts.js";
import { IAPITodoEdit, IAPITodoEditChecker, IAPITodoRcvAll, IAPITodoSetState, IAPITodoSetStateChecker } from "../../../types/api/project/TAPITodos.js";
import { ITodo } from "../../../types/data/project/TTodo.js";
import { checkApi } from "../../../../rgt/util/UApi.js";


//--------------------------------------------------
//                     ACCESS
//--------------------------------------------------
export const todoGet = async (req: Request, res: Response, _: unknown, status: number = 200) => {
	hasProject(req);

	const todos: ITodo[] = await Promise.all((
		await MTodo.find({project: req.project._id})
	).map((todo) => {
		return todo.getData()
	}))

	res.status(status).json({ 
		todos
	} as IAPITodoRcvAll);
};


//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const todoCreate = async (req: Request, res: Response) => {
	hasProject(req)

	const nDate = new Date(Date.now() + TIME_1D);
	nDate.setHours(0, 0, 0, 0);
	const todo = await MTodo.create({
		project: req.project._id,
		name: "New Task",
		date: nDate
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

export const todoEdit = async (req: Request, res: Response) => {
	hasTodo(req)
	const data: IAPITodoEdit = checkApi(req.body, IAPITodoEditChecker)

	if(req.todo.state != "current")
		throw {
			code: 503,
			message: "Todo is locked",
			log: `Todo: '${req.todo.name}' is locked, can't edit. Current state: '${req.todo.state}'`
		}

	await req.todo.updateOne(data.todo, {runValidators: true})

	todoGet(req, res, null, 200)
}

export const todoDelete = async (req: Request, res: Response) => {
	hasTodo(req)

	await req.todo.deleteOne()

	todoGet(req, res, null, 200)
}

//--------------------------------------------------
//                     ACTIONS
//--------------------------------------------------
export const todoSetState = async (req: Request, res: Response) => {
	hasTodo(req)
	const data: IAPITodoSetState = checkApi(req.body, IAPITodoSetStateChecker)
	await req.todo.updateOne({state: data.state}, {runValidators: true})
	todoGet(req, res, null, 200)
}