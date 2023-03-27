import { config } from "dotenv";

config();

export const DB_URI = process.env.DB_URI ?? "";
export const DB_USER = process.env.DB_USER ?? "";
export const DB_PASS = process.env.DB_PASS ?? "";
export const DB_NAME = process.env.DB_NAME ?? "";
