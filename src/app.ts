import { config } from "dotenv";
import express from "express";
import { Db } from "mongodb";
import path from "path";

import { DB_NAME, DB_PASS, DB_URI, DB_USER } from "./config/mongoConfig";
import { loadApiEndpoints } from "./controllers/api";
import { createRegisterEndpoint } from "./controllers/register";
import { IUserRepository } from "./repository/IUserRepository";
import { UserRepositoryMongo } from "./repository/UserRepositoryMongo";
import { MongoDatabase } from "./utils/connectDB";

config();
// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT ?? 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const database = new MongoDatabase({
	uri: DB_URI,
	user: DB_USER,
	password: DB_PASS,
	dbName: DB_NAME,
});
let userRepository: IUserRepository; //Injyectar en lugar de inicializar TODO

database
	.connect()
	.then(() => {
		// eslint-disable-next-line no-console
		console.log("Connected to database successfully");
		const db: Db = database.getDb();
		userRepository = new UserRepositoryMongo(db);

		// Initialize endpoints
		const registerEndpoint = createRegisterEndpoint(userRepository);

		// Add endpoints to app
		app.use("/register", registerEndpoint);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

loadApiEndpoints(app);

export default app;
