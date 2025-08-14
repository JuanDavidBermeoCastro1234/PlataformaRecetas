import dotenv from "dotenv";
import express from "express";
import usuariosRouter from "./routers/router.js";
import { connect } from "./db/config.js";

dotenv.config();

const port = process.env.PORT || 5500;
const app = express();

app.use(express.json());

app.use("/usuario",usuariosRouter);

connect().then(()=> {
    app.listen(port,()=>{
        console.log("http://localhost:"+port);
    });
})

