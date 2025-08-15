import { Router } from "express";
import {getDB} from "../db/config.js";

const router = Router();


router.post("/create", async (req, res) => {
  try {
    const { _id, nombre, pais, cedula, id_recetas } = req.body;

    // Validaciones básicas
    if (_id == null || !nombre || !pais || cedula == null) {
      return res.status(400).json({ error: "invalid input" });
    }

    // Construcción + normalización
    const usuario = {
      _id: Number(_id),
      nombre: String(nombre),
      pais: String(pais),
      cedula: Number(cedula),
      id_recetas: Array.isArray(id_recetas) ? id_recetas.map(Number) : [],
    };

    // Validar que id_recetas sea array de números
    if (!usuario.id_recetas.every(n => Number.isFinite(n))) {
      return res.status(400).json({ error: "id_recetas must be an array of numbers" });
    }

    await getDB().collection("usuarios").insertOne(usuario);

    return res.status(201).json({ message: "usuario created", _id: usuario._id });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "usuario already exists (duplicate _id)" });
    }
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
});


//traigo todos los usuarios y proyecto solamente los que quiero ver con projection en find esto es de mongodb
router.get("/getall", async function (req,res ) {
    try {
        const usuarios = await getDB().collection("usuarios").find({},{projection:{_id:1,nombre:1}}).toArray();
       return res.status(200).json(usuarios)

    } catch (error) {
       return res.status(500).json({error : "internal server error "});
    }
})

router.get("/getId/:id", async function (req,res) {
    try {
        const idusuario = parseInt(req.params.id);
        const usuarios = await getDB().collection("usuarios").findOne({_id:idusuario})
        if (!usuarios) {
         return   res.status(400).json({error :"usuario doesnt exist"});
        }
        res.status(200).json(usuarios)
    } catch (error) {
        return res.status(500).json({error:"internal server error"})
    }
});

router.put("/put/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid user id" });

    const { nombre, pais, cedula, id_recetas } = req.body;

    // Reemplazo total: campos requeridos
    if (!nombre || !pais || cedula == null) {
      return res.status(400).json({ error: "missing required fields (nombre, pais, cedula)" });
    }

    // id_recetas opcional, si viene debe ser array de números; si no, []
    let recetas = [];
    if (id_recetas !== undefined) {
      if (!Array.isArray(id_recetas)) {
        return res.status(400).json({ error: "id_recetas must be an array" });
      }
      recetas = id_recetas.map(Number);
      if (!recetas.every(Number.isFinite)) {
        return res.status(400).json({ error: "id_recetas must contain only numbers" });
      }
    }

    const usuario = {
      _id: id,
      nombre: String(nombre),
      pais: String(pais),
      cedula: Number(cedula),
      id_recetas: recetas,
    };

    if (!Number.isFinite(usuario.cedula)) {
      return res.status(400).json({ error: "cedula must be a number" });
    }

    const result = await getDB().collection("usuarios")
      .replaceOne({ _id: id }, usuario, { upsert: false });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "usuario doesnt exist" });
    }

    return res.status(200).json({ message: "usuario replaced", usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

/* PATCH /patch/:id — actualización parcial */
router.patch("/patch/:id", async function (req, res) {
  try {
    const idUsuario = parseInt(req.params.id, 10);
    const collection = getDB().collection("usuarios");

    const { nombre, pais, cedula, id_recetas } = req.body;
    const update = {};

    if (nombre !== undefined) update.nombre = nombre;
    if (pais !== undefined) update.pais = pais;
    if (cedula !== undefined) update.cedula = cedula;
    if (id_recetas !== undefined) update.id_recetas = id_recetas;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "no hay campos para actualizar" });
    }

    const result = await collection.updateOne(
      { _id: idUsuario },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "usuario no encontrado" });
    }

    return res.status(200).json({ message: "usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error en la conexión" });
  }
});


/* DELETE /delete/:id — elimina usuario + recetas asociadas */
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid user id" });

    // 1) obtener usuario para conocer sus id_recetas
    const user = await getDB().collection("usuarios").findOne({ _id: id });
    if (!user) return res.status(404).json({ error: "usuario doesnt exist" });

    const recetasIds = Array.isArray(user.id_recetas)
      ? user.id_recetas.map(Number).filter(Number.isFinite)
      : [];

    // 2) borrar recetas asociadas por user_id y por _id en id_recetas (por si acaso)
    const recetaFilter = {
      $or: [
        { user_id: id },
        recetasIds.length ? { _id: { $in: recetasIds } } : { _id: null }
      ]
    };

    const recetasResult = await getDB().collection("recetas").deleteMany(recetaFilter);

    // 3) borrar usuario
    const userResult = await getDB().collection("usuarios").deleteOne({ _id: id });

    return res.status(200).json({
      message: "usuario and related recipes deleted",
      deleted_user_count: userResult.deletedCount,
      deleted_recetas_count: recetasResult.deletedCount
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});



export default router