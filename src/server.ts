import app from "./app";
import { syncDatabase } from "#config/syncModels";
import dotenv from "dotenv";

import "./domains";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor", error);
  }
};

startServer();