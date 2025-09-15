import mongoose from "mongoose";
import config from "../config/index.js";
import { logger } from "../utils/logger.js";

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("MongoDB URI no esta definido en la configuración");
  }

  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Conectado a la base de datos correctamente.");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error("Error conectando a la base de datos", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Desconectado de la base de datos correctamente.");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error("Error desconectado de la base de datos", error);
  }
};
