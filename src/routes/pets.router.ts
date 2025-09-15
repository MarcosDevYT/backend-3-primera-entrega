import mongoose from "mongoose";
import PetsModel from "../dao/models/pet.model.js";

import { Router } from "express";

const petsRouter = Router();

petsRouter.get("/", async (req, res) => {
  try {
    const pets = await PetsModel.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las mascotas." });
  }
});

petsRouter.get("/:petId", async (req, res) => {
  try {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res
        .status(400)
        .json({ message: "El ID proporcionado no es un ObjectId válido." });
    }

    const pet = await PetsModel.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada." });
    }

    res.status(200).json(pet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al obtener la mascota.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al obtener la mascota.",
        details: String(error),
      });
    }
  }
});

petsRouter.post("/", async (req, res) => {
  const newPet = req.body;

  try {
    const result = await PetsModel.create(newPet);
    res.status(201).json({ message: "Mascota creada con éxito", pet: result });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la mascota." });
  }
});

petsRouter.put("/:petId", async (req, res) => {
  try {
    const { petId } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res
        .status(400)
        .json({ message: "El ID proporcionado no es un ObjectId válido." });
    }

    const updatedPet = await PetsModel.findByIdAndUpdate(petId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPet) {
      return res
        .status(404)
        .json({ message: "Mascota no encontrada para actualizar." });
    }

    res
      .status(200)
      .json({ message: "Mascota actualizada con éxito", pet: updatedPet });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al actualizar la mascota.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al actualizar la mascota.",
        details: String(error),
      });
    }
  }
});

petsRouter.delete("/:petId", async (req, res) => {
  try {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res
        .status(400)
        .json({ message: "El ID proporcionado no es un ObjectId válido." });
    }

    const deletedPet = await PetsModel.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res
        .status(404)
        .json({ message: "Mascota no encontrada para eliminar." });
    }

    res
      .status(200)
      .json({ message: "Mascota eliminada con éxito", pet: deletedPet });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error al eliminar la mascota.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error desconocido al eliminar la mascota.",
        details: String(error),
      });
    }
  }
});

export default petsRouter;
