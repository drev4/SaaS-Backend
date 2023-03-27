import mongoose, { ConnectOptions } from "mongoose";

const mongoURI: string = process.env.MONGO_URI ?? "";

interface CustomConnectOptions extends ConnectOptions {
	useNewUrlParser?: boolean;
	useUnifiedTopology: boolean;
	useCreateIndex: boolean;
}

const connectDB = async (): Promise<void> => {
	try {
		// Conecta a la base de datos MongoDB utilizando Mongoose
		const options: CustomConnectOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		};
		await mongoose.connect(mongoURI, options);

		//console.log(`Conectado a MongoDB: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error al conectar a MongoDB: ${(error as Error).message}`);
		process.exit(1);
	}
};

export default connectDB;
