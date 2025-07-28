import {NextFunction, Request, Response} from "express";
import {UserModel} from "../models/User";
import {ApiError} from "../errors/ApiError";
import bcrypt from "bcrypt";
import jwt, {JsonWebTokenError, JwtPayload, TokenExpiredError} from "jsonwebtoken";

const createAccessToken = (userId:string) => {
    return jwt.sign(
        {userId},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:'15m'}
    )
}

const createRefreshToken = (userId:string) => {
    return jwt.sign(
        {userId},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn:'7d'}
    )
}

export const signupUser = async (req:Request, res:Response, next:NextFunction) => {

    try {
        const {email, name, password} = req.body
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            email,
            name,
            password: hashPassword
        })
        await user.save()

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email
        }
        res.status(201).json(userWithoutPassword)
    } catch (error: any) {
        next(error)
    }
}

export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const {email, password} = req.body

        const user = await UserModel.findOne({email})

        if (!user) {
            throw new ApiError(401,"user not found")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(401,"Invalid email or password")
        }
        const accessToken = createAccessToken(user._id.toString())
        // console.log(accessToken)
        const refreshToken = createRefreshToken(user._id.toString())

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly:true,
            secure:isProd,
            maxAge:7*24*60*60*1000,
            path:"/api/auth/refresh-token",
        });
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken
        }
        res.status(201).json(userWithoutPassword)
    }catch (error: any){
        next(error)
    }
}


export const getAllUsers = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const users = await UserModel.find().select("-password");
        res.status(200).json(users);
    }catch(error: any){
        next(error)
    }
}

export const refreshToken = (req:Request,res:Response, next:NextFunction) => {
    try{
        const token = req.cookies?.refreshToken;
        if(!token){
            throw new ApiError(401, "Refresh token missing.");
        }
        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err:Error | null , decoded: string | JwtPayload | undefined) => {
                if(err){
                    if(err instanceof TokenExpiredError){
                        return next(new ApiError(401, "Refresh token expires"));
                    }else if(err instanceof JsonWebTokenError){
                        return next(new ApiError(401, "Invalid refresh token"));
                    }else {
                        return next(new ApiError(500, "Refresh token Error"));
                    }
                }
                if(!decoded || typeof decoded === "string"){
                    return next(new ApiError(401, "Refresh token payload Error"));
                }

                const userId = decoded.userId as string;
                const user = await UserModel.findById(userId)

                if (!user){
                    throw new ApiError(401, "User not found");
                }

                const newAccessToken = createAccessToken(userId.toString())
                res.status(201).json({accessToken: newAccessToken})

            }
        )
    }catch(error){
        next(error)
    }
}

export const logout = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const isProd = process.env.NODE_ENV === "production";

        res.cookie("refreshToken","", {
            httpOnly: true,
            secure: isProd,
            expires: new Date(0),
            path: "/api/auth/refresh-token",
        })

        res.status(200).json({message:"Logged out successfully"})
    }catch(error: any) {
        next(error)
    }
}