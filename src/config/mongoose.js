// Conexión a la base de datos MongoDB utilizando Mongoose.
import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

// Conexión a la base de datos y mensaje de confirmación.
(async () => {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("Conexión exitosa a la base de datos: ", db.connection.name);
})();
