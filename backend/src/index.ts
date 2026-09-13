import express from "express";
import cors from "cors";
import { API_BASE_SIMPLE, API_PROJECT, API_TODO, STATIC_IMAGES } from "./consts.js";
import { checkMongoDB } from "../rgt/middleware/db.js";
import userRouter from "../rgt/modules/users/router.js";
import { API_AUTH, API_USER } from "../rgt/consts.js";
import { errorMiddleware } from "../rgt/middleware/error.js";
import authRouter from "../rgt/modules/auth/router.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { verifyJWT } from "../rgt/middleware/jwt.js";
import projectRouter from "./modules/project/project/router.js";
import imageRouter from "./statics/images/router.js";
import { verifyProject } from "./middleware/project.js";
import todoRouter from "./modules/project/todo/router.js";

const app = express();

//MIDDLEWARES
app.use(
	cors({
		credentials: true,
		origin: ["http://localhost:8081"],
	}),
);
app.use(express.json());
app.use(helmet());
app.use(STATIC_IMAGES, imageRouter);
app.use(cookieParser());

//ROUTING
app.use((req, _res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);
	next();
});
//USER
app.use(API_BASE_SIMPLE + API_AUTH, authRouter);
app.use(API_BASE_SIMPLE + API_USER, userRouter);

//PROJECT
app.use(API_BASE_SIMPLE + API_PROJECT, verifyJWT, projectRouter);
app.use(API_BASE_SIMPLE + API_TODO, verifyJWT, verifyProject, todoRouter);

app.use(errorMiddleware);

checkMongoDB();

app.listen(8080, () => {
	console.log("Server is running on http://localhost:8080");
});
