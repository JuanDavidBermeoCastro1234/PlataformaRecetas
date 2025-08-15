import { Router } from "express";
import { getDB } from "../db/config.js";

const router = Router();

/* Agregar ingredientes a una receta (uno o varios) */
router.post("/add", async (req, res) => {
  try {
    const { receta_id, ingredientes } = req.body;
    if (receta_id == null || !ingredientes) {
      return res.status(400).json({ error: "invalid input" });
    }

    // Acepta string o array; lo guardamos como array de strings
    const toAdd = Array.isArray(ingredientes)
      ? ingredientes.map(String)
      : [String(ingredientes)];

    const result = await getDB().collection("recetas").updateOne(
      { _id: Number(receta_id) },
      { $addToSet: { ingredientes: { $each: toAdd } } } // evita duplicados
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "receta no encontrada" });
    }
    return res.status(200).json({ message: "ingredientes agregados" });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Ver todos los ingredientes de una receta */
router.get("/by-receta/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const doc = await getDB()
      .collection("recetas")
      .findOne({ _id: id }, { projection: { ingredientes: 1, _id: 0 } });

    if (!doc) return res.status(404).json({ error: "receta no encontrada" });
    return res.status(200).json({ ingredientes: doc.ingredientes || [] });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Eliminar ingredientes de una receta (uno o varios) */
router.delete("/remove", async (req, res) => {
  try {
    const { receta_id, ingredientes } = req.body;
    if (receta_id == null || !ingredientes) {
      return res.status(400).json({ error: "invalid input" });
    }

    const toRemove = Array.isArray(ingredientes)
      ? ingredientes.map(String)
      : [String(ingredientes)];

    const result = await getDB().collection("recetas").updateOne(
      { _id: Number(receta_id) },
      { $pull: { ingredientes: { $in: toRemove } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "receta no encontrada" });
    }
    return res.status(200).json({ message: "ingredientes eliminados" });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

/* Buscar recetas que contengan un ingrediente específico */
router.get("/search/:nombre", async (req, res) => {
  try {
    const nombre = String(req.params.nombre);
    // Búsqueda case-insensitive dentro del array de strings
    const docs = await getDB()
      .collection("recetas")
      .find({ ingredientes: { $regex: new RegExp(nombre, "i") } })
      .toArray();

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
