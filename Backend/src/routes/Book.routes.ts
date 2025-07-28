import {Router} from "express";
import {saveBook, deleteBook, getAllBook, getBookById, updateBook} from "../controller/BookController";
import {authenticateToken} from "../middlewares/authenticateToken";

const readerRouter = Router()
readerRouter.use(authenticateToken)

readerRouter.post("/", saveBook);
readerRouter.get("/", getAllBook);
readerRouter.get("/:id", getBookById);
readerRouter.delete("/:id", deleteBook);
readerRouter.put("/:id",updateBook)

export default readerRouter;