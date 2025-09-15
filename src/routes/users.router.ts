import UserModel from "../dao/models/user.model.js";
import { createHash, passwordValidation } from "../utils/index.js";
import mongoose from "mongoose";
import { Router } from "express";

const usersRouter = Router();

usersRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  if (!first_name || !last_name || !email || !password || !age)
    return res
      .status(400)
      .send({ status: "error", error: "Valores Incompletos" });

  try {
    const userExist = await UserModel.findOne({ email });

    if (userExist)
      return res
        .status(404)
        .send({ status: "error", error: "El Usuario ya existe" });

    const hashedPassword = await createHash(password);

    const user = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    };

    await UserModel.create(user);
    res.send({ status: "success", message: "Registrado" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al registrar el usuario.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al registrar el usuario.",
        details: String(error),
      });
    }
  }
});

usersRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Valores incompletos" });

  try {
    const user = await UserModel.findOne({ email });

    if (!user)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });

    const isValidPassword = await passwordValidation(user, password);

    if (!isValidPassword)
      return res
        .status(400)
        .send({ status: "error", error: "Contraseña incorrecta" });

    res.send({ status: "success", message: "Logeado" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al realizar el login.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al realizar el login.",
        details: String(error),
      });
    }
  }
});

usersRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
});

usersRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "El ID proporcionado no es un ObjectId válido.",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado." });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al obtener el usuario.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al obtener el usuario.",
        details: String(error),
      });
    }
  }
});

usersRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "El ID proporcionado no es un ObjectId válido.",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado para actualizar.",
      });
    }

    res
      .status(200)
      .json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al actualizar el usuario.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al actualizar el usuario.",
        details: String(error),
      });
    }
  }
});

usersRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "El ID proporcionado no es un ObjectId válido.",
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado para eliminar.",
      });
    }

    res
      .status(200)
      .json({ message: "Usuario eliminado con éxito", user: deletedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al eliminar el usuario.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al eliminar el usuario.",
        details: String(error),
      });
    }
  }
});

usersRouter.post("/", async (req, res) => {
  const newUser = req.body;

  try {
    const result = await UserModel.create(newUser);
    res.status(201).json({ message: "Usuario creado con éxito", user: result });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario." });
  }
});

export default usersRouter;
