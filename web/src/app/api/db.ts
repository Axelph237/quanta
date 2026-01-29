import { Db, MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB;

let db: Db | null = null;

export async function connectToDatabase() {
    try {
        if (db) return db;
        await client.connect();
        db = client.db(dbName);
        return db;
    } catch (err) {
        console.error("Failed to connect to database:", err);
        throw err;
    }
}

export const getDb = () => db;