import { ObjectId } from "mongodb"
import {connect,getDB} from "./config.js"


async function seedAll() {
    await connect();
    const recetas = [
        // Usuario 1 (Andrés)
    { _id: 1, user_id: 1, nombre: "Agua", descripcion: "Hacer tales", ingredientes: ["H", "2", "O"] },
    { _id: 2, user_id: 1, nombre: "Café", descripcion: "Hervir agua y agregar café", ingredientes: ["Agua", "Café"] },

    
    // Usuario 2 (María)
    { _id: 3, user_id: 2, nombre: "Ensalada", descripcion: "Mezclar vegetales frescos", ingredientes: ["Lechuga", "Tomate", "Pepino"] },
    { _id: 4, user_id: 2, nombre: "Sopa de verduras", descripcion: "Cocinar verduras en caldo", ingredientes: ["Zanahoria", "Papa", "Apio"] },

    // Usuario 3 (Juan)
    { _id: 5, user_id: 3, nombre: "Arroz blanco", descripcion: "Cocinar arroz con agua y sal", ingredientes: ["Arroz", "Agua", "Sal"] },
    { _id: 6, user_id: 3, nombre: "Pollo asado", descripcion: "Hornear pollo con especias", ingredientes: ["Pollo", "Pimienta", "Sal"] },
        { _id: 7, user_id: 4, nombre: "Té verde", descripcion: "Hervir agua y añadir té verde", ingredientes: ["Agua", "Té verde"] }

  
    ];    

    const usuarios =[
      { _id: 1, nombre: "Andres", cedula: 10245631, pais: "Colombia", id_recetas: [1, 2] },
    { _id: 2, nombre: "Maria", cedula: 20458963, pais: "Colombia", id_recetas: [3, 4] },
    { _id: 3, nombre: "Juan", cedula: 30547896, pais: "Colombia", id_recetas: [5, 6] },
        { _id: 4, nombre: "Luisa", cedula: 40658971, pais: "Colombia", id_recetas: [7] }

    ]

    await getDB().collection("usuarios").deleteMany();
    await getDB().collection("recetas").deleteMany();

    await getDB().collection("recetas").insertMany(recetas)
    await getDB().collection("usuarios").insertMany(usuarios)
    
    console.log("ok dataset");
    process.exit(0);
}

seedAll().catch(err=>{
    console.error(err);
    process.exit(1)
});
