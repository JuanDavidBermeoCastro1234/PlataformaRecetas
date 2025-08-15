import { Router } from "express";
import { getDB } from "../db/config.js";

const router = Router();

/* Crear receta (título = nombre, descripción) */
router.post("/create", async (req, res) => {
  try {
    const { _id, user_id, nombre, descripcion, ingredientes } = req.body;
    if (_id == null || user_id == null || !nombre || !descripcion) {
      return res.status(400).json({ error: "invalid input" });
    }

    const receta = {
      _id: Number(_id),
      user_id: Number(user_id),
      nombre: String(nombre),
      descripcion: String(descripcion),
      ingredientes: Array.isArray(ingredientes) ? ingredientes.map(String) : []
    };

    await getDB().collection("recetas").insertOne(receta);
    return res.status(201).json({ message: "receta creada", _id: receta._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Listar todas las recetas */
router.get("/getall", async (req, res) => {
  try {
    const docs = await getDB().collection("recetas").find().toArray();
    return res.status(200).json(docs);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Consultar una receta específica (incluye ingredientes) */
router.get("/get/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const doc = await getDB().collection("recetas").findOne({ _id: id });
    if (!doc) return res.status(404).json({ error: "receta no encontrada" });
    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Editar título (nombre) o descripción (PATCH) */
router.patch("/patch/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre, descripcion } = req.body;

    const update = {};
    if (nombre !== undefined) update.nombre = String(nombre);
    if (descripcion !== undefined) update.descripcion = String(descripcion);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "no hay campos para actualizar" });
    }

    const result = await getDB()
      .collection("recetas")
      .updateOne({ _id: id }, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "receta no encontrada" });
    }
    return res.status(200).json({ message: "receta actualizada" });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Eliminar receta */
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await getDB().collection("recetas").deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "receta no encontrada" });
    }
    return res.status(200).json({ message: "receta eliminada" });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Listar recetas por usuario (todas las recetas de un usuario específico) */
router.get("/by-user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const docs = await getDB()
      .collection("recetas")
      .find({ user_id: userId })
      .toArray();

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
