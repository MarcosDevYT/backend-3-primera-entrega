import PetsModel from "../dao/models/pet.model.js";
import UserModel from "../dao/models/user.model.js";
import { logger } from "../utils/logger.js";
import { generateMockPets } from "../utils/pet.mocking.js";
import { generateMockUsers } from "../utils/user.mocking.js";
import { Router } from "express";

const mockingRouter = Router();

mockingRouter.get("/mockingpets", (req, res) => {
  const pets = generateMockPets(100);
  logger.http("Generando Pets");
  res.status(200).json(pets);
});

mockingRouter.get("/mockingusers", (req, res) => {
  const users = generateMockUsers(50);
  logger.http("Generando Users");
  res.status(200).json(users);
});

mockingRouter.post("/generateData", async (req, res) => {
  const { users: numUsers, pets: numPets } = req.body;

  if (!numUsers || !numPets) {
    logger.error(
      "Error generando los datos, se debe especificar el numero de usuarios y mascotas"
    );
    return res
      .status(400)
      .json({ error: "Debes especificar el número de usuarios y mascotas." });
  }

  try {
    const usersToInsert = generateMockUsers(numUsers);
    await UserModel.insertMany(usersToInsert);

    const petsToInsert = generateMockPets(numPets);
    await PetsModel.insertMany(petsToInsert);

    logger.info(
      `${numUsers} usuarios y ${numPets} mascotas generados e insertados con exito`
    );
    res.status(201).json({
      message: `${numUsers} usuarios y ${numPets} mascotas generados e insertados con éxito.`,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error al generar e insertar datos: ${error}`);

      res.status(500).json({
        error: "Error al generar e insertar datos.",
        details: error.message,
      });
    } else {
      logger.error(`Error desconocido al generar e insertar datos: ${error}`);
      res.status(500).json({
        error: "Error desconocido al generar e insertar datos.",
        details: String(error),
      });
    }
  }
});

export default mockingRouter;
