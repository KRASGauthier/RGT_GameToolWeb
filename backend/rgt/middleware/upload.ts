import multer, { StorageEngine, type Multer } from "multer";
import type { Request } from "express";
import { randomUUID } from "node:crypto";
import path from "node:path";

const storage: StorageEngine = multer.diskStorage({
	destination: process.env.BACKEND_UPLOADE_LOCATION,
	filename: (_req: Request, file: Express.Multer.File, callback) => {
		callback(null, `${randomUUID()}${path.extname(file.originalname)}`);
	},
});

export const upload: Multer = multer({ storage });
