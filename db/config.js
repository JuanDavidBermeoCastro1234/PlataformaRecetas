import { MongoClient } from "mongodb";
import dotenv from  "dotenv";
dotenv.config();

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);
let db;

export async function connect() {
    try {
        await client.connect();
        console.log("ok mongodb connected");
        db= client.db(dbName);
    } catch (error) {
        console.error("error to connect")
    }
}

export function getDB() {
    if (!db) {
        throw new Error ("data base doesnt exists")
    }
    return db;
}
