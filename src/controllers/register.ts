import bcrypt from "bcrypt";
import express, { Request, Response, Router } from "express";

import { IUser, User } from "../models/User";
import { IUserRepository } from "../repository/IUserRepository";

interface IRegisterData {
	name: string;
	email: string;
	password: string;
}

export function createRegisterEndpoint(userRepository: IUserRepository): Router {
	const router = express.Router();

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	router.post("/", async (req: Request, res: Response): Promise<Response> => {
		// Recupera los datos del usuario del cuerpo de la solicitud
		const { name, email, password } = req.body as IRegisterData;

		// Valida los datos del usuario
		if (!name || !email || !password) {
			return res.status(400).json({ error: "Por favor, completa todos los campos." });
		}

		const existingUser = await userRepository.findByUsername(name);

		if (existingUser) {
			return res.status(400).send("Username already exists");
		}

		// Hashea la contraseña del usuario
		const hashedPassword: string = await bcrypt.hash(password, 10);

		// Crea un nuevo documento de usuario en la base de datos
		const user: IUser = { name, email, password: hashedPassword, isActive: false };
		const createdUser = await userRepository.create(user);

		// Envía una respuesta al cliente
		return res.status(201).json({ message: `Registro exitoso. ${createdUser.name}` });
	});

	return router;
}
