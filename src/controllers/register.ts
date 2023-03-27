import bcrypt from "bcrypt";
import express, { Request, Response } from "express";

import { IUser, User } from "../models/User";
import connectDB from "../utils/connectDB";

interface IRegisterData {
	name: string;
	email: string;
	password: string;
}

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/register", async (req: Request, res: Response): Promise<any> => {
	// Recupera los datos del usuario del cuerpo de la solicitud
	const { name, email, password } = req.body as IRegisterData;

	// Valida los datos del usuario
	if (!name || !email || !password) {
		return res.status(400).json({ error: "Por favor, completa todos los campos." });
	}

	// Conecta a la base de datos
	await connectDB();

	// Verifica si el correo electrónico ya está en uso
	const existingUser: IUser | null = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ error: "El correo electrónico ya está registrado." });
	}

	// Hashea la contraseña del usuario
	const hashedPassword: string = await bcrypt.hash(password, 10);

	// Crea un nuevo documento de usuario en la base de datos
	const newUser = new User({
		name,
		email,
		password: hashedPassword,
	});
	await newUser.save();

	// Envía una respuesta al cliente
	return res.status(201).json({ message: "Registro exitoso." });
});

export default router;
