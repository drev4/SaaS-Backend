import { Db, MongoClient, MongoClientOptions } from "mongodb";

interface DatabaseOptions {
	uri: string;
	user: string;
	password: string;
	dbName: string;
}

export class MongoDatabase {
	private pool: MongoClient | null = null;
	private readonly options: DatabaseOptions;

	constructor(options: DatabaseOptions) {
		console.log(options)
		this.options = options;
	}

	public async connect(): Promise<void> {
		const auth = {
			username: this.options.user,
			password: this.options.password,
		};

		const mongoOptions: MongoClientOptions = {
			auth,
			authSource: this.options.dbName,
			maxPoolSize: 10, // Set the maximum number of connections in the pool
		};

		try {
			this.pool = await MongoClient.connect(this.options.uri);
		} catch (err) {
			console.error(err);
			throw new Error("Failed to connect to database");
		}
	}

	public getDb(): Db {
		if (!this.pool) {
			throw new Error("Database pool not initialized");
		}

		return this.pool.db(this.options.dbName);
	}

	public async close(): Promise<void> {
		if (this.pool) {
			await this.pool.close();
			this.pool = null;
		}
	}
}
