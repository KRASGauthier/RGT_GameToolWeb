import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {
	API_BASE_SIMPLE,
	STATIC_IMAGES,
} from "./consts.js";

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

//DB CONNECTION
mongoose
	.connect(
		`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo:27017/${process.env.DB_NAME}?authSource=admin`,
	)
	.then(() => {
		"Node is connect to MongoDB";
	})
	.catch((error: unknown) => {
		console.error("MongoDB connection failed:", error);
		process.exit(1);
	});

app.listen(8080, () => {
	console.log("Server is running on http://localhost:8080");
});
