import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from "./db/mongo";
import rootRouter from "./routes";
import cors from "cors"
import cookieParser from "cookie-parser";
import {errorHandler} from "./middlewares/errorHandler";


dotenv.config();
const  app = express();
app.use(express.json());

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeader: ["Content-Type", "Authorization"],
}
app.use(cors(corsOptions))

//const PORT = 3000
const PORT = process.env.PORT;
app.use(cookieParser())

app.use("/api", rootRouter);
app.use(errorHandler)
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
})