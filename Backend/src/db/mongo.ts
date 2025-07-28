import * as mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL as string)
        console.log("Connected to mongoDB")
    }
    catch(error){
        console.log("Error connecting to Db",error)
        process.exit(1)
    }
}