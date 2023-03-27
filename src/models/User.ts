import { Model, model, Schema } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	password: string;
	isActive: boolean;
}

const userSchema: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isActive: { type: Boolean, required: true },
});

export const User: Model<IUser> = model<IUser>("User", userSchema);
