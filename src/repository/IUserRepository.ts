import { IUser } from "../models/User";

export interface IUserRepository {
	findByUsername(username: string): Promise<IUser | null>;
	create(user: IUser): Promise<IUser>;
	findByIdAndUpdate(id: string, update: Partial<IUser>): Promise<IUser | null>;
}
