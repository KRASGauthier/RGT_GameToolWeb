import express from "express";
import cors from "cors";
import {
	STATIC_IMAGES,
} from "./consts.js";
import { checkMongoDB } from "../rgt/middleware/db.js";

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

checkMongoDB();

app.listen(8080, () => {
	console.log("Server is running on http://localhost:8080");
});
