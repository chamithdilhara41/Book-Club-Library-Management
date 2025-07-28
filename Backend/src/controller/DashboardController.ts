import { Request, Response } from "express";
import { BookModel } from "../models/Book";
import { ReaderModel } from "../models/Reader";
import { LendingModel } from "../models/Lending";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Ensure models are correctly referenced and fields exist (like `active`)
        const totalBooks = await BookModel.estimatedDocumentCount(); // faster than countDocuments()
        const activeReaders = await ReaderModel.estimatedDocumentCount();
        const lentBooks = await LendingModel.estimatedDocumentCount();

        const recentLendings = await LendingModel.find({}) // empty filter means all
            .sort({ lendDate: -1 }) // sort by most recent
            .limit(5)
            .populate("bookId", "title")
            .populate("readerId", "name")
            .lean();

        const recentActivity = recentLendings.map((lending) => {
            const book = lending.bookId as { title?: string };
            const reader = lending.readerId as { name?: string };

            return {
                bookTitle: book?.title ?? "Unknown",
                readerName: reader?.name ?? "Unknown",
                lendDate: lending.lendDate,
                dueDate: lending.dueDate,
            };
        });

        res.status(200).json({
            totalBooks,
            activeReaders,
            lentBooks,
            recentActivity,
        });
    } catch (error: any) {
        console.error("Dashboard stats error:", error.message);
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message,
        });
    }
};

