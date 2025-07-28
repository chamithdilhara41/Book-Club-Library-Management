import { Request, Response, NextFunction } from 'express';
import { LendingModel } from '../models/Lending';
import {BookModel} from "../models/Book";

export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Received lending data:", req.body);
        const { bookId, readerId, dueDate, returnDate } = req.body;

        const book = await BookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }

        if (book.quantity <= 0) {
            return res.status(400).json({ error: 'No available copies to lend.' });
        }

        const newLending = await LendingModel.create({ bookId, readerId, dueDate, returnDate });

        // Decrease quantity and update availability
        book.quantity -= 1;
        if (book.quantity === 0) book.available = false;
        await book.save();

        return res.status(201).json(newLending);
    } catch (error) {
        next(error);
    }
};

// Return a book
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const lending = await LendingModel.findById(id);
        if (!lending) {
            return res.status(404).json({ error: 'Lending record not found.' });
        }

        if (lending.returned) {
            return res.status(400).json({ error: 'Book already returned.' });
        }

        lending.returnDate = new Date();
        lending.returned = true;
        await lending.save();

        // Increase quantity and mark as available if necessary
        const book = await BookModel.findById(lending.bookId);
        if (book) {
            book.quantity += 1;
            book.available = true;
            await book.save();
        }

        return res.json(lending);
    } catch (error) {
        next(error);
    }
};


// Get all lending records
export const getAllLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find()
            .populate('bookId')
            .populate('readerId')
            .sort({ lendDate: -1 });

        return res.json(lendings);
    } catch (error) {
        next(error);
    }
};

// Get lending history by reader
export const getLendingsByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { readerId } = req.params;
        const history = await LendingModel.find({ readerId }).populate('bookId');
        return res.json(history);
    } catch (error) {
        next(error);
    }
};

// Get lending history by book
export const getLendingsByBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        const history = await LendingModel.find({ bookId }).populate('readerId');
        return res.json(history);
    } catch (error) {
        next(error);
    }
};
