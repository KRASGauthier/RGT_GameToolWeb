# Mongoose TypeScript Quick Reference

## 1. Install

```bash
npm install mongoose
```

Mongoose already includes its TypeScript declarations. Do not install `@types/mongoose`.

---

## 2. Connect to MongoDB

```ts
import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
	await mongoose.connect(
		`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo:27017/myapp?authSource=admin`,
	);

	console.log("Connected to MongoDB");
}
```

Start the server only after the database connection succeeds:

```ts
try {
	await connectDatabase();

	app.listen(8080, () => {
		console.log("Server running on port 8080");
	});
} catch (error: unknown) {
	console.error("MongoDB connection failed:", error);
	process.exit(1);
}
```

- `mongodb://` is the MongoDB connection URI scheme.
- `mongo` is the Docker Compose service hostname.
- `27017` is MongoDB's default port.
- `myapp` is the database name.
- `authSource=admin` is required when authenticating with the Docker root user.

---

## 3. Define a Schema and Model

```ts
import { Schema, model } from "mongoose";

interface ITagDB {
	name: string;
	color: string;
}

const tagSchema = new Schema<ITagDB>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 50,
		},
		color: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export const Tag = model<ITagDB>("Tag", tagSchema);
```

- The schema defines the stored document structure.
- The model is used to query and modify the collection.
- `timestamps: true` adds `createdAt` and `updatedAt`.
- The model name `Tag` normally maps to the `tags` collection.

Explicit collection name:

```ts
export const Tag = model<ITagDB>("Tag", tagSchema, "tags");
```

---

## 4. Shared Frontend Type Versus Database Type

Suppose the frontend expects:

```ts
export interface ITag {
	uid: string;
	name: string;
	color: string;
}
```

MongoDB already creates `_id`, so the database does not need to store a separate `uid`.

```ts
type ITagDB = Omit<ITag, "uid">;
```

Schema:

```ts
const tagSchema = new Schema<ITagDB>({
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
});
```

Convert a MongoDB document before sending it to the frontend:

```ts
const result: ITag = {
	uid: document._id.toString(),
	name: document.name,
	color: document.color,
};
```

MongoDB's `_id` is an `ObjectId`, not a UUID. It is unique and can safely be exposed as a string identifier.

---

## 5. Create Documents

Direct creation:

```ts
const tag = await Tag.create({
	name: "Gameplay",
	color: "#ff0000",
});
```

Using a document instance:

```ts
const tag = new Tag({
	name: "Gameplay",
	color: "#ff0000",
});

await tag.save();
```

---

## 6. Read Documents

Read all:

```ts
const tags = await Tag.find();
```

Read by MongoDB ID:

```ts
const tag = await Tag.findById(req.params.id);
```

Read one matching document:

```ts
const tag = await Tag.findOne({
	name: "Gameplay",
});
```

Filtering, sorting, and limiting:

```ts
const tags = await Tag.find({
	name: {
		$regex: "game",
		$options: "i",
	},
})
	.sort({ name: 1 })
	.limit(20);
```

Select fields:

```ts
const tags = await Tag.find().select("name color");
```

For read-only API responses:

```ts
const tags = await Tag.find().lean();
```

`.lean()` returns plain JavaScript objects instead of full Mongoose documents.

---

## 7. Update Documents

Load, modify, and save:

```ts
const tag = await Tag.findById(req.params.id);

if (!tag) {
	throw new Error("Tag not found");
}

tag.name = "Updated name";
await tag.save();
```

Direct query update:

```ts
const tag = await Tag.findByIdAndUpdate(
	req.params.id,
	{
		name: "Updated name",
	},
	{
		returnDocument: "after",
		runValidators: true,
	},
);
```

Use `runValidators: true` when updating through query methods.

---

## 8. Delete Documents

```ts
const result = await Tag.deleteOne({
	_id: req.params.id,
});

if (result.deletedCount === 0) {
	throw new Error("Tag not found");
}
```

Or:

```ts
const deletedTag = await Tag.findByIdAndDelete(req.params.id);
```

---

## 9. Validation

Built-in validation:

```ts
const tagSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 50,
	},
	color: {
		type: String,
		required: true,
		match: /^#[0-9a-f]{6}$/i,
	},
});
```

Common validators:

- `required`
- `minlength`
- `maxlength`
- `min`
- `max`
- `enum`
- `match`
- custom `validate`

Custom validator:

```ts
name: {
	type: String,
	required: true,
	validate: {
		validator: (value: string) => !value.includes("/"),
		message: "Tag names cannot contain '/'",
	},
}
```

Handle validation errors:

```ts
try {
	const tag = await Tag.create(req.body);
	res.status(201).json(tag);
} catch (error: unknown) {
	if (error instanceof mongoose.Error.ValidationError) {
		res.status(400).json({
			error: Object.values(error.errors).map((validationError) => validationError.message),
		});
		return;
	}

	throw error;
}
```

---

## 10. References and `populate()`

Schema containing references:

```ts
import { Schema, Types, model } from "mongoose";

interface IArticle {
	title: string;
	tags: Types.ObjectId[];
}

const articleSchema = new Schema<IArticle>({
	title: {
		type: String,
		required: true,
	},
	tags: [
		{
			type: Schema.Types.ObjectId,
			ref: "Tag",
		},
	],
});

export const Article = model<IArticle>("Article", articleSchema);
```

Create a document containing references:

```ts
await Article.create({
	title: "My article",
	tags: [tag._id],
});
```

Load referenced documents:

```ts
const article = await Article.findById(id).populate("tags");
```

---

## 11. Middleware

Document middleware:

```ts
tagSchema.pre("save", function () {
	this.name = this.name.trim();
});
```

Important distinction:

- `document.save()` triggers `save` middleware.
- `findByIdAndUpdate()` does not trigger `save` middleware.
- Query updates require query middleware.

---

## 12. Typical Express Controller

```ts
import type { NextFunction, Request, Response } from "express";

export async function getTags(_req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const documents = await Tag.find().sort({ name: 1 }).lean();

		const tags: ITag[] = documents.map((document) => ({
			uid: document._id.toString(),
			name: document.name,
			color: document.color,
		}));

		res.status(200).json({
			tags,
		});
	} catch (error: unknown) {
		next(error);
	}
}
```

---

## 13. Core Mental Model

```text
TypeScript interface
        ↓
Mongoose schema
        ↓
Mongoose model
        ↓
Query or document operation
        ↓
MongoDB collection
```

For your shared frontend types:

```text
MongoDB document with _id
        ↓
API conversion
        ↓
Frontend object with uid
```
