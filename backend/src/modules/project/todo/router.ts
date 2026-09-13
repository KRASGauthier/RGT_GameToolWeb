import { Router } from "express";
import { todoCreate, todoGet } from "./controller.js";

const todoRouter = Router();

todoRouter.get("/", todoGet);
todoRouter.post("/", todoCreate);

export default todoRouter;
