import {ReaderModel} from "../models/Reader";
import {NextFunction, Request, Response} from "express";
import {ApiError} from "../errors/ApiError";

export const saveReader = async (req:Request, res:Response, next:NextFunction)=>{

    try{
        const reader = new ReaderModel(req.body)
        await reader.save()
        res.status(201).json(reader)
    } catch(error: any){
        next(error)
    }

}

export const getAllReader = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const readers = await ReaderModel.find()
        res.status(200).json(readers)
    }catch(error: any){
        next(error)
    }
}

export const deleteReader = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const deletedReader = await ReaderModel.findByIdAndDelete(req.params.id)
        if(!deletedReader){
            throw new ApiError(404, "Reader not found")
        }
        res.status(200).json({message:"Reader successfully deleted"})
    }catch(error: any){
        next(error)
    }
}

export const getReaderById = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const reader = await ReaderModel.findById(req.params.id)
        if(!reader){
            throw new ApiError(404, "Reader not found")
        }
        res.status(200).json(reader)
    }catch (error: any){
        next(error)
    }
}

export const updateReader = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const updatedReader = await ReaderModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                //if true -> return the updated reader
                //if false -> return the old reader
                runValidators: true
                //run the validates before updating
            });
        if(!updatedReader){
            throw new ApiError(404, "Reader not found")
        }
        res.status(200).json(updatedReader)
    }catch(error: any){
        next(error)
    }
}
