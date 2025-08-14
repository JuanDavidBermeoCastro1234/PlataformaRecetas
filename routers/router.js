import { Router } from "express";
import {getDB} from "../db/config.js";

const router = Router();

//traigo todos los usuarios y proyecto solamente los que quiero ver con projection en find esto es de mongodb
router.get("/getall", async function (req,res ) {
    try {
        const usuarios = await getDB().collection("usuarios").find({},{projection:{_id:1,nombre:1}}).toArray();
        res.status(200).json(usuarios)

    } catch (error) {
        res.status(500).json({error : "internal server error "});
    }
})

router.get("/getId/:id", async function (req,res) {
    try {
        const idusuario = parseInt(req.params.id);
        const usuarios = await getDB().collection("usuarios").findOne({_id:idusuario}).toArray();
        if (!usuarios) {
            res.status(400).json({error :"usuario doesnt exist"});
        }
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({error:"internal server error"})
    }
})

export default router