import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Book } from "../types/Book";
import BooksTable from "../components/tables/BooksTable";
import BookForm from "../components/forms/BookForm";
import axios from "axios";
import toast from "react-hot-toast";

import {
    addBook,
    deleteBook,
    getAllBooks,
    updateBook
} from "../services/BookService.ts";

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const fetchAllBooks = async () => {
        try {
            setIsBooksLoading(true);
            const result = await getAllBooks();
            setBooks(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsBooksLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const removeBook = async (id: string) => {
        await deleteBook(id);
    };

    const handleAddBook = () => {
        setSelectedBook(null);
        setIsAddDialogOpen(true);
    };

    const handleEditBook = (book: Book) => {
        setSelectedBook(book);
        setIsEditDialogOpen(true);
    };

    const handleDeleteBook = (book: Book) => {
        setSelectedBook(book);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (bookData: Omit<Book, "_id">) => {
        if (selectedBook) {
            try {
                const updatedBook = await updateBook(selectedBook._id, bookData);
                setBooks((prev) =>
                    prev.map((b) => (b._id === selectedBook._id ? updatedBook : b))
                );
                setIsEditDialogOpen(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message);
                } else {
                    toast.error("Something went wrong");
                }
            }
        } else {
            try {
                const newBook = await addBook(bookData);
                setBooks((prev) => [...prev, newBook]);
                setIsAddDialogOpen(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message);
                } else {
                    toast.error("Something went wrong");
                }
            }
        }
        setSelectedBook(null);
    };

    const confirmDelete = async () => {
        if (selectedBook) {
            try {
                await removeBook(selectedBook._id);
                fetchAllBooks();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message);
                } else {
                    toast.error("Something went wrong");
                }
            } finally {
                setIsDeleteDialogOpen(false);
                setSelectedBook(null);
            }
        }
    };

    const cancelDialog = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
    };

    if (isBooksLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Books</h1>
                    <button
                        onClick={handleAddBook}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        <MdAdd className="w-5 h-5" />
                        <span>Add Book</span>
                    </button>
                </div>

                <BooksTable books={books} onEdit={handleEditBook} onDelete={handleDeleteBook} />

                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) form.requestSubmit();
                    }}
                    title="Add New Book"
                >
                    <BookForm onSubmit={handleFormSubmit} />
                </Dialog>

                <Dialog
                    isOpen={isEditDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) form.requestSubmit();
                    }}
                    title="Edit Book"
                >
                    <BookForm book={selectedBook} onSubmit={handleFormSubmit} />
                </Dialog>

                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmDelete}
                    title="Delete Book"
                >
                    <p className="text-gray-700">
                        Are you sure you want to delete <strong>{selectedBook?.title}</strong>? This action cannot be undone.
                    </p>
                </Dialog>
            </div>
        </div>
    );
};

export default BooksPage;
