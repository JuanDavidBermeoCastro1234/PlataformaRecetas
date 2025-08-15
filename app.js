import dotenv from "dotenv";
import express from "express";
import usuariosRouter from "./routers/router.js";
import recetasRouter from "./routers/recetas.routes.js";
import ingredientesRouter from "./routers/ingredientes.routes.js";

import { connect } from "./db/config.js";

dotenv.config();

const port = process.env.PORT || 5500;
const app = express();

app.use(express.json());

app.use("/usuario",usuariosRouter);
app.use("/recetas", recetasRouter);       // ← NUEVO
app.use("/ingredientes", ingredientesRouter); // ← NUEVO

connect().then(()=> {
    app.listen(port,()=>{
        console.log("http://localhost:"+port);
    });
})

