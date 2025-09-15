import express from "express";
import mockingRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import { logger } from "./utils/logger.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/mongoose.js";
import config from "./config/index.js";

const app = express();

app.use(express.json());

app.use("/api/mocks", mockingRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);

// Iniciar server
(async () => {
  try {
    await connectToDatabase();

    app.get("/", (req, res) => {
      res.send("¡Servidor funcionando correctamente!");
    });

    app.listen(config.PORT, () => {
      logger.info(
        `Servidor escuchando en el puerto: http://localhost:${config.PORT}`
      );
    });
  } catch (error) {
    logger.error("Failed to start the server", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();

    logger.info("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    logger.error("Error during server shutdown", error);
    process.exit(1);
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
