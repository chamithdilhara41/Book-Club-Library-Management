import {Router} from "express";
import {signupUser, getAllUsers, loginUser, refreshToken, logout} from "../controller/auth.controller";
import {authenticateToken} from "../middlewares/authenticateToken";

const authRouter = Router()

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);
authRouter.get("/users", authenticateToken, getAllUsers);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;