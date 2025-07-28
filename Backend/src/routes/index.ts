import {Router} from "express";
import readerRouter from "./Reader.routes";
import bookRouts from "./Book.routes";
import authRoutes from "./Auth.routes";
import lendingRoutes from "./Lending.routes";
import overdueRoutes from "./Overdue.routes";
import dashboardRoutes from "./Dashboard.routes";
const roomRouter = Router()

roomRouter.use("/overdues", overdueRoutes);
roomRouter.use("/dashboard", dashboardRoutes);
roomRouter.use("/books",bookRouts);
roomRouter.use("/lendings",lendingRoutes);
roomRouter.use("/readers",readerRouter);
roomRouter.use("/auth",authRoutes);

export default roomRouter;