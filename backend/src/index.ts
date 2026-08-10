import express from "express";
import cors from "cors";
import { API_BASE_SIMPLE, STATIC_IMAGES } from "./consts.js";
import { checkMongoDB } from "../rgt/middleware/db.js";
import userRouter from "../rgt/users/router.js";
import { API_USER } from "../rgt/consts.js";
import { errorMiddleware } from "../rgt/middleware/error.js";

const app = express();

//MIDDLEWARES
app.use(cors({ origin: ["http://localhost:8081"] }));
app.use(express.json());
app.use(
	STATIC_IMAGES,
	express.static(process.env.BACKEND_UPLOADE_LOCATION ?? "/home/app/uploaded-dev"),
);

//ROUTING
app.use((req, _res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);
	next();
});
app.use(API_BASE_SIMPLE + API_USER, userRouter);

app.use(errorMiddleware);

checkMongoDB();

app.listen(8080, () => {
	console.log("Server is running on http://localhost:8080");
});
