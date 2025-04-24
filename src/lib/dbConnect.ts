import mongoose from "mongoose";

interface ConnectionObject {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log('Already Connected to the Database');
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;
        console.log('Database Connected');
    } catch (error) {
        console.log('Database Connection Failed',error)
    }

}