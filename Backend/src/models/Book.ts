import * as mongoose from "mongoose";

type Book = {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedDate: string;
    genre: string;
    quantity: number;
    available: boolean;
};

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [2, "Title must be at least 2 characters"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        minlength: [3, "Author must be at least 3 characters"],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        trim: true,
        match: [/^[\d\-]{10,17}$/, "Enter a valid ISBN number"]
    },
    publishedDate: {
        type: String,
        required: [true, "Published date is required"]
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
        minlength: [3, "Genre must be at least 3 characters"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    available: {
        type: Boolean,
    }
});

export const BookModel = mongoose.model("Book", bookSchema);
