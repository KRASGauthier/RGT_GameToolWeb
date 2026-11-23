import { Router } from "express";
import { todoCreate, todoDelete, todoEdit, todoGet, todoSetState } from "./controller.js";
import { API_PROJECT_TODO_STATE, API_PROJECT_TODO_TARGET } from "../../../consts.js";
import { verifyTodo } from "./middleware.js";

const todoRouter = Router();

todoRouter.get("/", todoGet);
todoRouter.post("/", todoCreate);

todoRouter.patch(API_PROJECT_TODO_TARGET, verifyTodo, todoEdit);
todoRouter.patch(API_PROJECT_TODO_TARGET + API_PROJECT_TODO_STATE, verifyTodo, todoSetState);
todoRouter.delete(API_PROJECT_TODO_TARGET, verifyTodo, todoDelete);

export default todoRouter;
