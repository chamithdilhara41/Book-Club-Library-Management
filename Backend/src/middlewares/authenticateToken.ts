import {NextFunction,Request,Response} from "express";
import jwt, {JsonWebTokenError, JwtPayload, TokenExpiredError} from "jsonwebtoken";
import {ApiError} from "../errors/ApiError";

export const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
    try{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        console.log(token);
        if(!token){
            throw new ApiError(403, "Access token not found.");
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
            (err, decoded) => {
                if(err){
                    console.log(err)
                    if(err instanceof TokenExpiredError){
                        next(new ApiError(403, "Access Token expires"))
                    }
                    if(err instanceof JsonWebTokenError){
                        next(new ApiError(403, "Invalid access token expires"))
                    }else {
                        next(new ApiError(500, "Internal Server Error"))
                    }
                }
                if(!decoded || typeof decoded === "string"){
                    throw new ApiError(500, "Access token payload Error");
                }
                next()
            })
    }catch(error){
        next(error)
    }
}

