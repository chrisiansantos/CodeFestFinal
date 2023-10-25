import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Prueba2:1234@cluster0.ut5ekrq.mongodb.net/?retryWrites=true&w=majority";
export const PORT = process.env.PORT || 3000;
