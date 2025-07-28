import {Router} from "express";
import {saveReader, deleteReader, getAllReader, getReaderById, updateReader} from "../controller/ReaderController";
import {authenticateToken} from "../middlewares/authenticateToken";

const readerRouter = Router()
readerRouter.use(authenticateToken)

readerRouter.post("/", saveReader);
readerRouter.get("/", getAllReader);
readerRouter.get("/:id", getReaderById);
readerRouter.delete("/:id", deleteReader);
readerRouter.put("/:id",updateReader)

export default readerRouter;