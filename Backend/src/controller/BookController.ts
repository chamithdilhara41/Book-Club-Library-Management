import { BookModel } from "../models/Book";
import {NextFunction, Request, Response} from "express";
import {ApiError} from "../errors/ApiError";

export const saveBook = async (req:Request, res:Response, next:NextFunction)=>{

    try{
        const book = new BookModel(req.body)
        await book.save()
        res.status(201).json(book)
    } catch(error: any){
        next(error)
    }

}

export const getAllBook = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const books = await BookModel.find()
        res.status(200).json(books)
    }catch(error: any){
        next(error)
    }
}

export const deleteBook = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const deletedBook = await BookModel.findByIdAndDelete(req.params.id)
        if(!deletedBook){
            throw new ApiError(404, "Book not found")
        }
        res.status(200).json({message:"Book successfully deleted"})
    }catch(error: any){
        next(error)
    }
}

export const getBookById = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const book = await BookModel.findById(req.params.id)
        if(!book){
            throw new ApiError(404, "Book not found")
        }
        res.status(200).json(book)
    }catch (error: any){
        next(error)
    }
}

export const updateBook = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                //if true -> return the updated reader
                //if false -> return the old reader
                runValidators: true
                //run the validates before updating
            });
        if(!updatedBook){
            throw new ApiError(404, "Book not found")
        }
        res.status(200).json(updatedBook)
    }catch(error: any){
        next(error)
    }
}
