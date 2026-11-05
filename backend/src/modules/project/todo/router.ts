import { Router } from "express";
import { todoCreate } from "./controller.js";

const todoRouter = Router();

todoRouter.post("/", todoCreate)

export default todoRouter