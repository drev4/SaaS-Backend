import { Db, ObjectId } from "mongodb";

import { IUser } from "../models/User";
import { IUserRepository } from "./IUserRepository";

export class UserRepositoryMongo implements IUserRepository {
	private readonly db: Db;
	private readonly collectionName = "users";

	constructor(db: Db) {
		this.db = db;
	}

	async findByUsername(username: string): Promise<IUser | null> {
		const collection = this.db.collection<IUser>(this.collectionName);

		return collection.findOne({ username });
	}

	async create(user: IUser): Promise<IUser> {
		const collection = this.db.collection<IUser>(this.collectionName);
		const result = await collection.insertOne(user);

		return { ...user, _id: result.insertedId } as IUser;
	}

	async findByIdAndUpdate(id: string, update: Partial<IUser>): Promise<IUser | null> {
		const objectId = new ObjectId(id);
		const collection = this.db.collection<IUser>(this.collectionName);
		const result = await collection.findOneAndUpdate(
			{ _id: objectId },
			{ $set: update },
			{ returnDocument: "after" }
		);

		return result.value ? (result.value as IUser) : null;
	}
}
